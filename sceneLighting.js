// ============================================================================
// 1. SCENE LIGHTING, DAYLIGHT FOG & PROCEDURAL ENV MAP (sceneLighting.js)
// ============================================================================
(function (global) {
  "use strict";

  function createFuturisticDaylightEnvMap(renderer) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, "#9bcaff");
    grad.addColorStop(0.45, "#cbe5ff");
    grad.addColorStop(0.50, "#ffffff");
    grad.addColorStop(0.55, "#e3f0ff");
    grad.addColorStop(1.0, "#d0dbe5");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    const sunGrad = ctx.createRadialGradient(360, 72, 4, 360, 72, 68);
    sunGrad.addColorStop(0.0, "rgba(255, 250, 240, 1.0)");
    sunGrad.addColorStop(0.3, "rgba(255, 250, 240, 0.55)");
    sunGrad.addColorStop(1.0, "rgba(255, 250, 240, 0.0)");
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, 512, 256);

    const tex = new THREE.CanvasTexture(canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.encoding = THREE.sRGBEncoding;

    if (renderer && typeof THREE.PMREMGenerator !== "undefined") {
      try {
        const pmrem = new THREE.PMREMGenerator(renderer);
        pmrem.compileEquirectangularShader();
        const envRT = pmrem.fromEquirectangular(tex);
        tex.dispose();
        pmrem.dispose();
        return envRT.texture;
      } catch (e) {
        return tex;
      }
    }
    return tex;
  }

  function setupFuturisticWhiteSceneLighting(scene, renderer) {
    scene.background = new THREE.Color(0xcbe5ff);
    scene.fog = new THREE.Fog(0xe3f0ff, 120, 300);

    const envMap = createFuturisticDaylightEnvMap(renderer);
    scene.environment = envMap;

    const ambientLight = new THREE.AmbientLight(0xc4d8e2, 0.88);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xcbe5ff, 0xe3f0ff, 0.35);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaf0, 1.45);
    sunLight.position.set(60, 110, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 260;

    const shadowExtent = 58;
    sunLight.shadow.camera.left = -shadowExtent;
    sunLight.shadow.camera.right = shadowExtent;
    sunLight.shadow.camera.top = shadowExtent;
    sunLight.shadow.camera.bottom = -shadowExtent;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xeef4fa,
      roughness: 0.85,
      metalness: 0.05
    });
    const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.08;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    const subtleGrid = new THREE.GridHelper(1600, 160, 0xc5d6e8, 0xdbe7f4);
    subtleGrid.position.y = -0.05;
    scene.add(subtleGrid);

    return { ambientLight, sunLight, envMap, groundMesh, subtleGrid };
  }

  global.setupFuturisticWhiteSceneLighting = setupFuturisticWhiteSceneLighting;
  global.createFuturisticDaylightEnvMap = createFuturisticDaylightEnvMap;
})(window);
