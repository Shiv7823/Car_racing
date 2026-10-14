// ============================================================================
// DEVICE DETECTOR, 3 GRAPHICS TIERS & CAPPED CLOCK RENDER LOOP (renderPipeline.js)
// ============================================================================
(function (global) {
  "use strict";

  const GRAPHICS_TIERS = {
    low: {
      id: "low",
      label: "LOW (MOBILE)",
      maxPixelRatio: 1.0,
      antialias: false,
      shadowsEnabled: false,
      carShadowOnly: false,
      blobShadowVisible: true,
      bloomEnabled: false
    },
    medium: {
      id: "medium",
      label: "MEDIUM",
      maxPixelRatio: 1.5,
      antialias: true,
      shadowsEnabled: true,
      carShadowOnly: true,
      blobShadowVisible: false,
      bloomEnabled: false
    }
  };

  function detectMobileDevice() {
    return (
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
      ("ontouchstart" in window && window.innerWidth <= 1024)
    );
  }

  function createBlobShadowMesh() {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext("2d");
    const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0.0, "rgba(0, 0, 0, 0.85)");
    grad.addColorStop(0.55, "rgba(0, 0, 0, 0.48)");
    grad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(c);
    const geo = new THREE.PlaneGeometry(3.1, 5.5);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 0.03, 0);
    return mesh;
  }

  class GraphicsPerformancePipeline {
    constructor({ scene, camera, dirLight, barrierMesh, carInstances }) {
      this.scene = scene;
      this.camera = camera;
      this.dirLight = dirLight;
      this.barrierMesh = barrierMesh;
      this.carInstances = carInstances || [];
      this.isMobile = detectMobileDevice();
      this.currentTier = this.isMobile ? "low" : "medium";

      this.renderer = new THREE.WebGLRenderer({
        antialias: !this.isMobile,
        powerPreference: "high-performance"
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;

      this.composer = null;
      this.bloomPass = null;
      if (
        typeof THREE.EffectComposer !== "undefined" &&
        typeof THREE.RenderPass !== "undefined" &&
        typeof THREE.UnrealBloomPass !== "undefined"
      ) {
        const renderPass = new THREE.RenderPass(scene, camera);
        const bloomRes = new THREE.Vector2(
          Math.floor(window.innerWidth * 0.5),
          Math.floor(window.innerHeight * 0.5)
        );
        this.bloomPass = new THREE.UnrealBloomPass(bloomRes, 1.10, 0.45, 0.24);
        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(renderPass);
        this.composer.addPass(this.bloomPass);
      }

      this.clock = new THREE.Clock();
      this.applyTier(this.currentTier);
    }

    applyTier(tierKey) {
      if (!GRAPHICS_TIERS[tierKey]) tierKey = "medium";
      this.currentTier = tierKey;
      const cfg = GRAPHICS_TIERS[tierKey];

      const dpr = Math.min(window.devicePixelRatio || 1, cfg.maxPixelRatio);
      this.renderer.setPixelRatio(dpr);
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      if (this.composer) {
        this.composer.setPixelRatio(dpr);
        this.composer.setSize(window.innerWidth, window.innerHeight);
        if (this.bloomPass) {
          this.bloomPass.resolution.set(
            Math.floor(window.innerWidth * 0.5),
            Math.floor(window.innerHeight * 0.5)
          );
        }
      }

      this.renderer.shadowMap.enabled = cfg.shadowsEnabled;
      if (this.dirLight) this.dirLight.castShadow = cfg.shadowsEnabled;
      if (this.barrierMesh) {
        this.barrierMesh.castShadow = cfg.shadowsEnabled && !cfg.carShadowOnly;
      }
      this.renderer.shadowMap.needsUpdate = true;

      this.carInstances.forEach((inst) => {
        if (inst.blobShadow) inst.blobShadow.visible = cfg.blobShadowVisible;
        if (inst.underglowLight) inst.underglowLight.visible = tierKey !== "low";
      });
    }

    getCappedDelta() {
      return Math.min(Math.max(this.clock.getDelta(), 0.001), 0.1);
    }

    renderFrame() {
      const cfg = GRAPHICS_TIERS[this.currentTier];
      if (this.composer && cfg.bloomEnabled) {
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    }
  }

  global.GraphicsPerformancePipeline = GraphicsPerformancePipeline;
  global.createBlobShadowMesh = createBlobShadowMesh;
})(window);
