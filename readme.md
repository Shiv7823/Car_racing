# APEX LEGENDS CIRCUIT — 3D Cyberpunk Racing Game

A premium, high-performance 3D arcade racing game built with **Three.js (r128)**, custom PBR/emissive shaders, **UnrealBloomPass** post-processing, and serverless **WebRTC / BroadcastChannel multiplayer**.

Play instantly in any modern web browser on **Laptop (Keyboard/Mouse)** and **Mobile (Multi-Touch)** with zero plugins or backend servers required.

---

## Features

- **Iconic 3D Car Structures**:
  - **BMW M4 GT3**: Twin-kidney grille, quad icon LED headlights, M-power dome hood, swan-neck GT3 wing.
  - **Mercedes-AMG GT Black Series**: Panamericana vertical-slat grille, central star emblem, long bi-turbo hood, double-deck aero wing.
  - **Porsche 911 GT3 RS**: Low sloped frunk, raised front fenders with oval headlights, fastback engine deck, high-mount RS wing.
  - **Lamborghini Revuelto V12**: Ultra-low angular wedge body, Y-blade LED headlights, side hexagonal air intakes, roof shark fin.
  - **Ferrari SF90 XX Stradale**: S-duct front aerodynamic nose, flying-buttress fastback cabin, quad circular tail lamps.
  - **8 Custom Factory Paint Finishes**: Marina Blue, Rosso Corsa Red, Verde Mantis, AMG Solarbeam Gold, GT Silver, Stealth Matte Black, Ultra Violet, and Miami Sunset Orange.

- **Real-Time Human Multiplayer (Zero Bots)**:
  - **Cross-Device Room Codes**: Connect laptop and mobile players over peer-to-peer WebRTC via PeerJS using a simple 4-digit code.
  - **Instant Multi-Tab Sync**: Open multiple tabs on the same computer to race head-to-head automatically via `BroadcastChannel`.
  - **Zero AI Bots**: Races only include real players who joined the room.

- **Host Customizations & Dynamic Lap Targets**:
  - **Customizable Lap Targets**: Host chooses 1, 2, 3, 5, or 10 laps. The game concludes immediately when the first player finishes the target number of laps.
  - **Dynamic Atmospheres**: Cyber Night, Sunset Gold, Bright Day, and Storm Fog.
  - **Weather & Track Palettes**: Clear Dry, Neon Rain (wet asphalt + rain streaks), and Solar Gold.

- **Arcade Driving & Drift Physics**:
  - Longitudinal acceleration, braking/reverse, speed-dependent steering, and high-slip handbrake drifting.
  - Suspension pitch (acceleration squat & braking dive) and cornering body roll.
  - Speed-warped dynamic chase camera (`60°` to `86°` FOV stretch) with smooth spring damping.
  - Road barrier collision ricochets and car-to-car elastic impulse separation with sparks.

- **Cross-Platform Controls**:
  - **Laptop / Desktop**: `W` / `↑` (Gas), `S` / `↓` (Brake/Reverse), `A` / `D` / `←` / `→` (Steer), `Space` (Handbrake Drift), `Shift` (Nitro Boost), `B` (Toggle Bloom), `R` (Reset).
  - **Mobile / Touchscreen**: Ergonomic on-screen touch pads for steering, gas, brake, drift, and nitro.

---

## Project Structure

```text
├── index.html     # Complete single-file game (HTML5, CSS, Three.js & WebRTC client)
├── README.md      # Documentation and deployment instructions
└── LICENSE        # MIT License
```

---

## Getting Started

### Local Testing
Simply open `index.html` in any modern desktop or mobile browser (Chrome, Edge, Firefox, Safari).

To run a quick local HTTP server:
```bash
# Python 3
python3 -m http.server 8000

# Node.js (npx)
npx serve .
```
Navigate to `http://localhost:8000` in your browser.

---

## Deployment (Vercel, Netlify, GitHub Pages)

### Vercel
1. Push your repository to GitHub containing `index.html` at the root.
2. In the [Vercel Dashboard](https://www.google.com/search?q=https%3A%2F%2Fvercel.com%2F), click **New Project** and import your repository.
3. Leave Build Command and Output Directory blank (Static Site).
4. Click **Deploy**. Vercel will serve your game at `https://your-project.vercel.app/`.

### GitHub Pages
1. Go to repository **Settings** &rarr; **Pages**.
2. Under **Build and deployment**, set Source to **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`.
4. Click **Save**.

---

## Technology Stack

- **Three.js (r128)**: WebGL 3D rendering engine.
- **UnrealBloomPass / EffectComposer**: HDR bloom post-processing pipeline.
- **WebRTC / PeerJS**: Peer-to-peer cross-device multiplayer state synchronization.
- **HTML5 Canvas & Web Audio API**: Procedural HUD gauges, minimap, and rain effects.

---

## License

This project is licensed under the [MIT License](https://www.google.com/search?q=LICENSE).
