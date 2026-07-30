import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { USDZExporter } from 'three/addons/exporters/USDZExporter.js';
// Removed problematic fflate import that was breaking the script

let currentUnit = 'mm';
const UNIT_TO_MM = { mm: 1, cm: 10, in: 25.4 };
const PLACEHOLDERS = {
  mm: ['300', '200', '150'],
  cm: ['30', '20', '15'],
  in: ['11.8', '7.9', '5.9']
};
const UNIT_LABEL = { mm: 'mm', cm: 'cm', in: 'in' };

let scene, camera, renderer, controls, boxGroup;
let isReady = false;

function selectUnit(unit) {
  currentUnit = unit;
  
  // Highlight active button
  document.querySelectorAll('.unit-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.unit === unit);
  });

  // Update placeholders
  const [lp, wp, hp] = PLACEHOLDERS[unit];
  document.getElementById('length').placeholder = lp;
  document.getElementById('width').placeholder = wp;
  document.getElementById('height').placeholder = hp;
  
  updateConvHint();
}

function toMM(val) {
  return val * UNIT_TO_MM[currentUnit];
}

function updateConvHint() {
  const L = parseFloat(document.getElementById('length').value);
  const W = parseFloat(document.getElementById('width').value);
  const H = parseFloat(document.getElementById('height').value);
  const hint = document.getElementById('convHint');
  if (!L && !W && !H) { hint.textContent = ''; return; }
  if (currentUnit === 'mm') { hint.textContent = ''; return; }
  const lmm = isNaN(L) ? '—' : toMM(L).toFixed(1);
  const wmm = isNaN(W) ? '—' : toMM(W).toFixed(1);
  const hmm = isNaN(H) ? '—' : toMM(H).toFixed(1);
  hint.textContent = `≈ ${lmm} × ${wmm} × ${hmm} mm`;
}

function markFile(input, dropId) {
  const el = document.getElementById(dropId);
  if (input.files && input.files[0]) {
    el.classList.add('has-file');
    const n = input.files[0].name;
    el.querySelector('div').textContent = '✓ ' + (n.length > 16 ? n.slice(0, 14) + '…' : n);
  } else {
    el.classList.remove('has-file');
    el.querySelector('div').textContent = '＋ Upload';
  }
}

function initThree() {
  const container = document.getElementById('viewer');
  const W = container.clientWidth;
  const H = container.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, W / H, 0.01, 2000);
  camera.position.set(6, 5, 8);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;

  const key = new THREE.DirectionalLight(0xffffff, 3.0);
  key.position.set(6, 8, 6);
  scene.add(key);
  
  const fill = new THREE.DirectionalLight(0xc8d4ff, 1.5);
  fill.position.set(-5, 2, -5);
  scene.add(fill);
  
  scene.add(new THREE.AmbientLight(0xffffff, 1.0));

  window.addEventListener('resize', () => {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  isReady = true;
  loop();
}

function loop() {
  requestAnimationFrame(loop);
  controls.update();
  renderer.render(scene, camera);
}

function readTexture(id) {
  return new Promise(resolve => {
    const file = document.getElementById(id).files[0];
    if (!file) return resolve(null);
    const fr = new FileReader();
    fr.onload = e => {
      const loader = new THREE.TextureLoader();
      loader.load(e.target.result, texture => {
        texture.colorSpace = THREE.SRGBColorSpace;
        resolve(texture);
      });
    };
    fr.readAsDataURL(file);
  });
}

function buildBox(L, W, H, fx) {
  if (boxGroup) {
    scene.remove(boxGroup);
    boxGroup = null;
  }
  boxGroup = new THREE.Group();

  function createMaterial(key) {
    return new THREE.MeshStandardMaterial({
      map: fx[key] || null,
      color: fx[key] ? 0xffffff : 0x333540,
      side: THREE.DoubleSide,
      roughness: 0.4,
      metalness: 0.1
    });
  }

  function addFace(geo, m, px, py, pz, rx, ry, rz) {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(px, py, pz);
    mesh.rotation.set(rx || 0, ry || 0, rz || 0);
    boxGroup.add(mesh);
  }

  // Front (+Z)
  addFace(new THREE.PlaneGeometry(L, H), createMaterial('frontImg'), 0, 0, W/2, 0, 0, 0);
  
  // Back (-Z)
  addFace(new THREE.PlaneGeometry(L, H), createMaterial('backImg'), 0, 0, -W/2, 0, Math.PI, 0);
  
  // Right (+X)
  addFace(new THREE.PlaneGeometry(W, H), createMaterial('rightImg'), L/2, 0, 0, 0, Math.PI/2, 0);
  
  // Left (-X)
  addFace(new THREE.PlaneGeometry(W, H), createMaterial('leftImg'), -L/2, 0, 0, 0, -Math.PI/2, 0);
  
  // Bottom (-Y)
  addFace(new THREE.PlaneGeometry(L, W), createMaterial('bottomImg'), 0, -H/2, 0, Math.PI/2, 0, 0);
  
  // Top front flap
  addFace(new THREE.PlaneGeometry(L, W/2), createMaterial('topFrontImg'), 0, H/2, W/4, -Math.PI/2, 0, 0);
  
  // Top back flap
  const tbMat = createMaterial('topBackImg');
  addFace(new THREE.PlaneGeometry(L, W/2), tbMat, 0, H/2, -W/4, -Math.PI/2, 0, Math.PI);

  // Full top (alternative to front/back flaps)
  if (fx['fullTopImg']) {
    // Remove the front and back flaps if full top is provided
    boxGroup.children = boxGroup.children.filter(child => {
      return !(child.geometry instanceof THREE.PlaneGeometry && 
               Math.abs(child.position.y - H/2) < 0.01 &&
               Math.abs(child.position.z) > W/8);
    });
    addFace(new THREE.PlaneGeometry(L, W), createMaterial('fullTopImg'), 0, H/2, 0, -Math.PI/2, 0, 0);
  }

  // Wireframe helper
  const wireGeo = new THREE.BoxGeometry(L, H, W);
  const wireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(wireGeo),
    new THREE.LineBasicMaterial({ color: 0x555666, transparent: true, opacity: 0.5 })
  );
  wireframe.name = "wireframe"; // Named for exclusion during export
  boxGroup.add(wireframe);

  scene.add(boxGroup);
}

async function generatePreview() {
  const rawL = parseFloat(document.getElementById('length').value);
  const rawW = parseFloat(document.getElementById('width').value);
  const rawH = parseFloat(document.getElementById('height').value);

  if (!rawL || !rawW || !rawH || rawL <= 0 || rawW <= 0 || rawH <= 0) {
    ['length', 'width', 'height'].forEach(id => {
      const el = document.getElementById(id);
      el.classList.add('error');
      setTimeout(() => el.classList.remove('error'), 1400);
    });
    return;
  }

  const Lmm = toMM(rawL);
  const Wmm = toMM(rawW);
  const Hmm = toMM(rawH);

  setTxt('Building…');

  if (!isReady) initThree();
  
  document.getElementById('placeholder').style.display = 'none';

  const faceIds = ['frontImg', 'backImg', 'leftImg', 'rightImg', 'bottomImg', 'topFrontImg', 'topBackImg', 'fullTopImg'];
  const fx = {};
  await Promise.all(faceIds.map(async id => { 
    fx[id] = await readTexture(id); 
  }));

  // Scale down for visualization (10mm = 1 unit)
  buildBox(Lmm / 10, Wmm / 10, Hmm / 10, fx);

  // Adjust camera to fit
  const maxD = Math.max(Lmm, Wmm, Hmm) / 10;
  camera.position.set(maxD * 1.5, maxD * 1.2, maxD * 1.8);
  controls.target.set(0, 0, 0);
  controls.update();

  const ul = UNIT_LABEL[currentUnit];
  document.getElementById('dimReadout').textContent = `${rawL} × ${rawW} × ${rawH} ${ul}`;
  setDot('statusDot', '#00f2fe');
  setDot('renderDot', '#00f2fe');
  setTxt('Preview ready');

  document.getElementById('exportGlb').disabled = false;
  document.getElementById('exportUsdz').disabled = false;

  if (window.innerWidth <= 768) {
    document.getElementById('viewer-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Show floating AR button on mobile if it's iOS
    if (isIOS) {
      document.getElementById('floatingArBtn').style.display = 'flex';
    }
  }
}

function setDot(id, col) {
  const el = document.getElementById(id);
  if (el) el.style.cssText = `background:${col};box-shadow:0 0 10px ${col}`;
}

function setTxt(t) {
  const el = document.getElementById('renderStatus');
  if (el) el.textContent = t;
}

async function exportGLB() {
  if (!boxGroup) return;
  setTxt('Exporting GLB…');
  
  // Hide wireframe temporarily
  const wireframe = boxGroup.getObjectByName("wireframe");
  if (wireframe) wireframe.visible = false;

  const exporter = new GLTFExporter();
  exporter.parse(boxGroup, (result) => {
    if (wireframe) wireframe.visible = true;
    
    const blob = new Blob([result], { type: 'model/gltf-binary' });
    downloadFile(blob, 'box-model.glb');
    setTxt('GLB exported ✓');
  }, (err) => {
    if (wireframe) wireframe.visible = true;
    console.error('GLB Export Error:', err);
    setTxt('GLB Export failed');
  }, { binary: true });
}

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

async function exportUSDZ() {
  if (!boxGroup) return;
  
  if (typeof fflate === 'undefined') {
    alert('The zipping library (fflate) is still loading. Please wait a moment and try again.');
    return;
  }

  setTxt('Building USDZ…');
  
  try {
    // Clone the group for export to avoid flickering the main view
    const exportGroup = boxGroup.clone();
    
    // Hide wireframe in the clone
    const wireframe = exportGroup.getObjectByName("wireframe");
    if (wireframe) exportGroup.remove(wireframe);

    // Scale for AR (Converting our cm-based units to Meters for Apple AR)
    // 1 unit = 10mm = 1cm. 1cm = 0.01m.
    exportGroup.scale.set(0.01, 0.01, 0.01);

    const exporter = new USDZExporter();
    const arraybuffer = await exporter.parse(exportGroup);
    
    // CRITICAL: Correct MIME type for AR Quick Look
    const blob = new Blob([arraybuffer], { type: 'model/vnd.usdz+zip' });
    const blobUrl = URL.createObjectURL(blob);

    setTxt('Opening in AR…');
    
    // iOS: Use rel="ar" for AR Quick Look
    // Android: Will download as USDZ file
    if (isIOS) {
      // iOS AR Quick Look - using rel="ar" attribute
      const arLink = document.createElement('a');
      arLink.rel = 'ar';
      arLink.href = blobUrl;
      arLink.download = 'box-model.usdz';
      arLink.style.display = 'none';
      
      document.body.appendChild(arLink);
      arLink.click();
      
      // Cleanup after a delay
      setTimeout(() => {
        if (document.body.contains(arLink)) {
          document.body.removeChild(arLink);
        }
        // Keep blob URL alive a bit longer for iOS
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      }, 500);
      
      setTxt('AR View ready ✓');
    } else {
      // Android and others: Regular download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'box-model.usdz';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      setTxt('USDZ exported ✓');
    }
  } catch (err) {
    console.error('USDZ Export Error:', err);
    alert('USDZ Export failed: ' + err.message);
    setTxt('Export failed');
  }
}

// Update UI for iPhone
if (isIOS) {
  const usdzBtn = document.getElementById('exportUsdz');
  if (usdzBtn) usdzBtn.textContent = 'View in AR (iPhone)';
}

function downloadFile(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById('generateBtn').addEventListener('click', generatePreview);
document.getElementById('exportGlb').addEventListener('click', exportGLB);
document.getElementById('exportUsdz').addEventListener('click', exportUSDZ);
const floatingArBtn = document.getElementById('floatingArBtn');
if (floatingArBtn) floatingArBtn.addEventListener('click', exportUSDZ);

// Resizable Sidebar Logic
const resizer = document.getElementById('resizer');
const leftPanel = document.getElementById('left-panel');
let isResizing = false;

resizer.addEventListener('mousedown', (e) => {
  isResizing = true;
  resizer.classList.add('active');
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
});

window.addEventListener('mousemove', (e) => {
  if (!isResizing) return;
  const newWidth = e.clientX - 20; // accounting for margin
  if (newWidth >= 280 && newWidth <= 600) {
    leftPanel.style.width = `${newWidth}px`;
    // Force Three.js to update
    const container = document.getElementById('viewer');
    if (renderer && camera) {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
  }
});

window.addEventListener('mouseup', () => {
  if (isResizing) {
    isResizing = false;
    resizer.classList.remove('active');
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }
});

document.querySelectorAll('.unit-pill').forEach(btn => {
  btn.addEventListener('click', (e) => selectUnit(e.currentTarget.dataset.unit));
});

['length', 'width', 'height'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateConvHint);
});

const faceInputs = ['frontImg', 'backImg', 'leftImg', 'rightImg', 'bottomImg', 'topFrontImg', 'topBackImg', 'fullTopImg'];
faceInputs.forEach(id => {
  document.getElementById(id).addEventListener('change', (e) => markFile(e.target, 'drop-' + id));
});