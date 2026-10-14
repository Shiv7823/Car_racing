# APEX LEGENDS CIRCUIT — 3D Futuristic Racing Game

A premium, high-performance 3D arcade racing game built with **Three.js (r128)**, clean daylight PBR shaders, **UnrealBloomPass** post-processing, and serverless **WebRTC / BroadcastChannel multiplayer**.

Play instantly in any modern web browser on **Laptop (Keyboard/Mouse)** and **Mobile (Multi-Touch)** with zero plugins or backend servers required.

---

## Features

- **Futuristic White Racing Circuit**:
  - Soft daylight blue sky (`#cbe5ff`), linear atmospheric fog (`#e3f0ff`), warm daylight directional sun (`#fffaf0`), and soft ambient fill (`#c4d8e2`).
  - Crisp charcoal asphalt track (`#2a2d32`), accented by vivid neon orange-red and clean white curbs, and clean white safety barriers (`#f7faff`).
  - Low-draw-call instanced white geometric architecture (archways, terraced grandstands, and minimalist towers using `THREE.InstancedMesh` keeping scene draw calls < 40).

- **Iconic 3D Car Structures**:
  - **BMW M4 GT3**: Signature twin-kidney front grille, quad icon LED headlights, M-power dome hood, swan-neck GT3 wing. Built with `MeshPhysicalMaterial` (metalness: 0.8, roughness: 0.2, clearcoat: 0.9, daylight reflections).
  - **Mercedes-AMG GT Black Series**: Wide Panamericana vertical-slat grille, central star emblem, long bi-turbo hood, double-deck aero wing.
  - **Porsche 911 GT3 RS**: Low sloped frunk, raised front fenders with oval headlights, fastback engine deck, high-mount RS wing.
  - **Lamborghini Revuelto V12**: Ultra-low angular wedge body, Y-blade LED headlights, side hexagonal air intakes, roof shark fin.
  - **Ferrari SF90 XX Stradale**: S-duct front aerodynamic nose, flying-buttress fastback cabin, quad circular tail lamps.
  - **8 Custom Factory Paint Finishes**: Marina Blue, Rosso Corsa Red, Verde Mantis, AMG Solarbeam Gold, GT Silver, Stealth Matte Black, Ultra Violet, and Miami Sunset Orange.
  - **Dynamic Emissive Brake Lights**: Rear tail lamps brighten dynamically to intensity 4.2 when braking or reversing.
  - **Chassis Blob Shadow Plane**: Radial-gradient circular contact shadow plane beneath the chassis for grounded realism.

- **Real-Time Human Multiplayer (Zero Bots)**:
  - **Cross-Device Room Codes**: Connect laptop and mobile players over peer-to-peer WebRTC via PeerJS using a simple 4-digit code.
  - **Instant Multi-Tab Sync**: Open multiple tabs on the same computer to race head-to-head automatically via `BroadcastChannel`.
  - **Zero AI Bots**: Races only include real players who joined the room.

- **Host Customizations & Dynamic Lap Targets**:
  - **Customizable Lap Targets**: Host chooses 1, 2, 3, 5, or 10 laps. The game concludes immediately when the first player finishes the target number of laps.
  - **Dynamic Atmospheres**: Cyber Night, Sunset Gold, Bright Day, and Storm Fog.
  - **Weather & Track Palettes**: Clear Dry, Neon Rain (wet asphalt + rain streaks), and Solar Gold.

- **Mobile & Laptop Controls**:
  - **Laptop / Desktop**: `W` / `↑` (Gas), `S` / `↓` (Brake/Reverse), `A` / `D` / `←` / `→` (Steer), `Space` (Handbrake Drift), `Shift` (Nitro Boost), `G` (Cycle Graphics Tier), `R` (Reset).
  - **Mobile Multitouch HUD**: Thumb-friendly left/right steering pads on the bottom-left, gas foot-pedal icon, brake disc icon, nitro flame icon, and drift button on the bottom-right supporting simultaneous multi-touch.
  - **Orientation Guard**: Automatic landscape enforcement overlay when holding a phone in portrait mode.
  - **Gesture Lock**: Blocks pull-to-refresh, double-tap zoom, and long-press menus.

- **Graphics Performance Presets**:
  - **Low (Mobile Default)**: Pixel ratio capped at 1.0, shadow map off, car blob shadow plane, antialias off.
  - **Medium**: Pixel ratio capped at 1.5, directional shadows on cars only.
  - **Physics Safety**: Delta time capped at 0.1s via `THREE.Clock` to prevent physics explosions on frame drops.

---

## File Structure

```text
├── index.html                       # Complete, self-contained playable game
├── README.md                        # Documentation & setup guide
├── LICENSE                          # MIT License
├── sceneLighting.js                 # Daylight lighting, fog & procedural reflection map
├── trackMaterialsAndArchitecture.js # Crisp asphalt, vivid curbs & instanced white architecture
├── carShaderSetup.js                # BMW M4 GT3 MeshPhysicalMaterial, brake lights & blob shadow
├── touchController.js               # Simultaneous multitouch HUD, gesture & orientation guards
├── hud.css                          # Mobile & desktop responsive HUD styling
└── renderPipeline.js                # Graphics presets (Low/Med/High) & capped delta-time loop
```

---

## Deployment (Vercel, Netlify, GitHub Pages)

### Vercel
1. Upload `index.html` to the root of your GitHub repository (`Shiv7823/Car_racing`).
2. Vercel automatically deploys within 15–20 seconds.
3. Open `https://carracinggame-psi.vercel.app/`.

### Local Testing
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve .
```

---

## License

This project is licensed under the [MIT License](LICENSE).
