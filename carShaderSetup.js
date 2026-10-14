// ============================================================================
// 3. BMW M4 GT3 CLEARCOAT PHYSICAL SHADER, BRAKE LIGHTS & BLOB SHADOW
//    (carShaderSetup.js)
// ============================================================================
(function (global) {
  "use strict";

  function createCircularBlobShadowMesh() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 62);
    grad.addColorStop(0.0, "rgba(15, 22, 34, 0.78)");
    grad.addColorStop(0.55, "rgba(15, 22, 34, 0.38)");
    grad.addColorStop(1.0, "rgba(15, 22, 34, 0.0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    const geo = new THREE.CircleGeometry(2.2, 28);
    geo.rotateX(-Math.PI / 2);
    geo.scale(0.82, 1.0, 1.32);

    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 0.025, 0);
    return mesh;
  }

  function createBMWM4GT3Materials(paintHex, accentHex, envMap) {
    const PhysicalMatClass = THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial;

    const bodyPaintMaterial = new PhysicalMatClass({
      color: paintHex,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      envMap: envMap || null,
      envMapIntensity: 1.35
    });

    const carbonTrimMaterial = new PhysicalMatClass({
      color: 0x1c2026,
      metalness: 0.5,
      roughness: 0.35,
      clearcoat: 0.6,
      envMap: envMap || null,
      envMapIntensity: 0.9
    });

    const glassCanopyMaterial = new PhysicalMatClass({
      color: 0x0b1524,
      metalness: 0.9,
      roughness: 0.08,
      clearcoat: 1.0,
      envMap: envMap || null,
      envMapIntensity: 1.6
    });

    const brakeLightMaterial = new THREE.MeshStandardMaterial({
      color: 0xb80818,
      emissive: 0xff0a1e,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.1
    });

    const accentTrimMaterial = new THREE.MeshStandardMaterial({
      color: accentHex,
      emissive: accentHex,
      emissiveIntensity: 0.45,
      metalness: 0.8,
      roughness: 0.2
    });

    return {
      bodyPaintMaterial,
      carbonTrimMaterial,
      glassCanopyMaterial,
      brakeLightMaterial,
      accentTrimMaterial
    };
  }

  function updateBrakeLightState(carInstance, isBraking) {
    if (!carInstance || !carInstance.brakeLightMat) return;
    const targetIntensity = isBraking ? 4.2 : 0.65;
    carInstance.brakeLightMat.emissiveIntensity = targetIntensity;
    carInstance.brakeLightMat.color.setHex(isBraking ? 0xff2a38 : 0xb80818);
  }

  global.createCircularBlobShadowMesh = createCircularBlobShadowMesh;
  global.createBMWM4GT3Materials = createBMWM4GT3Materials;
  global.updateBrakeLightState = updateBrakeLightState;
})(window);
