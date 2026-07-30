# 📦 Box Studio — Admin Panel

Box Studio is a phenomenal, highly-interactive 3D Box generation and preview tool directly in your browser. With an immersive, premium glassmorphism UI, it allows users to specify custom dimensions, map high-quality image textures to any face of the box, and seamlessly export the result for AR (Augmented Reality) or 3D Web applications.

## ✨ Phenomenal Features

- **Immersive 3D Viewer:** Built with Three.js, taking up the full screen width and height for a stunning interactive background. Left-click to orbit, right-click to pan, and scroll to zoom.
- **Glassmorphism Design:** A minimalist, premium UI with beautifully frosted glass control panels (backdrop filters) and engaging neon accents (`#00f2fe`).
- **Dynamic Unit Conversion:** Seamlessly switch your box's input dimensions between **millimeters (mm)**, **centimeters (cm)**, and **inches (in)**.
- **Face Texturing:** Individual drag-and-drop / upload areas for mapping images smoothly to any face of the bounding box (Front, Back, Left, Right, Top Front, Top Back, and Bottom).
- **Responsive Layout:** Beautiful UI mapping that transitions cleanly into a vertical scroll on mobile/tablet devices.
- **1-Click Generation:** Quickly parse inputs, merge textures, build an optimized 3D geometry scene, and present it instantly.
- **Advanced 3D Export Pipeline:** 
  - **GLB:** Perfect for WebXR, Blender, Unity, or standard web viewing.
  - **USDZ:** Specially packed with `fflate` into an Apple-compatible USDZ file for instant AR rendering natively on iPhone (iOS AR QuickLook) devices!

## 🚀 How To Use

You do not need any complex build steps or node modules structure to run this!

### Setup

1. **Clone or Download** this directory.
2. Ensure you have the `index.html` alongside your chosen texture image maps.
3. **Open the project using a local web server.** Because this project uses modern JavaScript modules (ESM), browsers require a server (like VSCode Live Server, Python `http.server`, or `npx serve`) to load the files securely. Simply double-clicking the HTML file may result in CORS errors.

### Usage Workflow

1. Navigate to the **Dimensions** section and specify your box sizes (Length, Width, Height). Switch your preferred units via the toggle pills.
2. Open the **Face Textures** section and click the upload buttons to assign standard images (`.png`, `.jpg`, `.jpeg`) to specific faces of the box design.
3. Once satisfied with the selections, hit the glowing **Generate Preview** button.
4. Use your mouse/finger to orbit and pan around the fully generated 3D box scene.
5. In the **Export 3D** drawer, select your desired export format (GLB or USDZ) to save the final file locally!

## 🛠️ Stack & Technologies Used

- **Core:** HTML5, CSS3 (Vanilla Native Custom Variables), JavaScript (Vanilla ES6)
- **3D Pipeline:** [Three.js](https://threejs.org/) (r128) for the rendering, meshes, textures, materials, scene setup, lights, and Orbital Controls. 
- **Typography:** Google Fonts: `Outfit` (Headings structure) & `Inter` (Data labels & readable specs).
- **Exporting Engines:** `GLTFExporter` (for `.glb` format)
- **Local Zipping:** [fflate](https://github.com/101arrowz/fflate) is bundled locally to manually inject generated ASCII meshes into a `.usdz + zip` payload to satisfy Apple’s strict augmented reality standards natively from pure JavaScript.

## 🎨 UI Aesthetic

The user interface of Box Studio implements **Modern Glassmorphism** layered directly on top of the 3D `<canvas>` viewer. We apply `-webkit-backdrop-filter: blur(28px);` directly to the command panel and complement it with carefully tuned translucent backgrounds (`rgba(18, 19, 24, 0.6)`) to give it a stunning, suspended reality floating look over the active 3D geometric visualization.
