<div align="center">

# 📦 Box Studio — Admin Panel

**A premium, high-fidelity 3D box visualizer, design tool, and export engine built directly in the browser.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
[![iOS AR Ready](https://img.shields.io/badge/Apple_AR_QuickLook-000000?style=for-the-badge&logo=apple&logoColor=white)](#)

*Design your packaging, preview it live in high-fidelity 3D, and deploy or share it directly to iOS AR and Android with perfect physical dimensions.*

[Key Features](#-phenomenal-features) • [Quick Start](#-quick-start) • [Export Pipeline](#-advanced-export-pipeline) • [UI Aesthetic](#-premium-ui-aesthetic)

</div>

---

## ✨ Phenomenal Features

*   **Immersive 3D Viewer:** Powered by **Three.js**, taking up the full screen width and height as an interactive background. Supporting smooth orbiting, panning, and zooming.
*   **Modern Glassmorphism UI:** A sleek, premium control panel styled with frosted glass backdrop filters (`blur(28px)`) and cyber-cyan accents (`#00f2fe`).
*   **Multi-Unit Precision Engine**: Seamlessly switch your box's input dimensions between **millimeters (mm)**, **centimeters (cm)**, and **inches (in)** with instant visual resizing.
*   **Per-Face Texturing**: Drag-and-drop or upload custom images (`.png`, `.jpg`, `.jpeg`) to wrap specific faces (Front, Back, Left, Right, Bottom, Top Front, Top Back, or Full Top).
*   **Mobile-First Responsive Layout**: Elements stack dynamically on smaller screens, complete with a floating **"View in AR"** shortcut button for iOS devices.
*   **Instant Export Pipeline**:
    *   **GLB Format**: Perfect for WebXR, Blender, Unity, or standard web 3D viewers.
    *   **USDZ (iOS AR)**: Specially compiled locally with `fflate` into an Apple-compatible USDZ file for instant AR Quick Look placement.

---

## 🚀 Quick Start

Because this project uses modern JavaScript modules (ESM), browsers require an HTTP server to load files securely. Double-clicking `index.html` directly will trigger CORS security blocks.

Here are the easiest terminal commands to serve and run the project locally:

### Option 1: Node.js (Recommended)
```bash
npx http-server -p 8080
```

### Option 2: Python
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

Once running, navigate to [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🛠️ Advanced Export Pipeline

### 1. Real-World AR Scaling (Meters)
Standard 3D canvas rendering operates in unit scales (e.g. `30` units for a 30cm box). In real-world AR systems, `1 unit = 1 meter`. 
Our exporter automatically applies a `0.01` scaling factor to the model matrices prior to exporting. This ensures that the generated GLB and USDZ models open exactly at their correct physical dimensions (e.g. 30cm wide instead of 30 meters wide) in Google Scene Viewer and Apple AR Quick Look, preventing floating or separated face meshes.

### 2. Safari Async-Click Bypass
iOS Safari restricts the launch of `rel="ar"` Apple Quick Look viewers to synchronous, user-initiated click gestures. Any asynchronous delays (such as running `await exporter.parse()`) will cause Safari to block the AR preview.
To bypass this restriction:
- The export buttons are configured as native HTML `<a>` anchor tags.
- The USDZ model is asynchronously pre-compiled in the background the moment **Generate Preview** is clicked.
- Once ready, the compiled USDZ file is bound as a Blob URL directly to the anchor `href`, enabling **instant, synchronous launch** when the client clicks the button.

---

## 🎨 Premium UI Aesthetic

Box Studio features an ultra-modern glassmorphic design that floats on top of the 3D `<canvas>` environment.

```
+--------------------------------------------------------+
|  [📐 Control Panel]                                     |
|  - Dimensions (mm/cm/in)       [      3D Canvas      ] |
|  - Face Texture Uploads        [                     ] |
|  - Generate Preview Button     [  (Interact with Box) ] |
|                                [                     ] |
|  [⬇️ Export Drawer]            [   [📦 View in AR]   ] |
|  - GLB Format | USDZ (iOS AR)                          |
+--------------------------------------------------------+
```

---

## 🗂️ Project Directory Structure

```
Box_website/
├── index.html     # HTML5 Semantic layout & importmaps
├── style.css      # Core Design System, Variables & Responsive Grid
├── script.js     # Three.js pipeline, exporters, and event logic
└── README.md      # Project documentation
```
