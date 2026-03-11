// let scene,camera,renderer,controls,box

// const length=localStorage.getItem("length")
// const width=localStorage.getItem("width")
// const height=localStorage.getItem("height")

// init()

// function init(){

// scene=new THREE.Scene()

// camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

// camera.position.z=5

// renderer=new THREE.WebGLRenderer({antialias:true})

// renderer.setSize(window.innerWidth,window.innerHeight)

// document.getElementById("viewer").appendChild(renderer.domElement)

// controls=new THREE.OrbitControls(camera,renderer.domElement)

// controls.enableDamping=true

// const light=new THREE.DirectionalLight(0xffffff,1)

// light.position.set(5,5,5)

// scene.add(light)

// scene.add(new THREE.AmbientLight(0xffffff,0.5))

// createBox()

// animate()

// }

// function loadTexture(name){

// const data=localStorage.getItem(name)

// if(!data) return null

// return new THREE.TextureLoader().load(data)

// }

// function createBox(){

// const geometry=new THREE.BoxGeometry(length/10,height/10,width/10)

// const materials=[

// new THREE.MeshBasicMaterial({map:loadTexture("rightImg")}),
// new THREE.MeshBasicMaterial({map:loadTexture("leftImg")}),
// new THREE.MeshBasicMaterial({map:loadTexture("topImg")}),
// new THREE.MeshBasicMaterial({map:loadTexture("bottomImg")}),
// new THREE.MeshBasicMaterial({map:loadTexture("frontImg")}),
// new THREE.MeshBasicMaterial({map:loadTexture("backImg")})

// ]

// box=new THREE.Mesh(geometry,materials)

// scene.add(box)

// }

// function animate(){

// requestAnimationFrame(animate)

// controls.update()

// renderer.render(scene,camera)

// }

// document.getElementById("downloadBtn").onclick=function(){

// const exporter=new THREE.GLTFExporter()

// exporter.parse(box,function(result){

// const blob=new Blob([result],{type:"model/gltf-binary"})

// const link=document.createElement("a")

// link.href=URL.createObjectURL(blob)

// link.download="box.glb"

// link.click()

// },{binary:true})

// }