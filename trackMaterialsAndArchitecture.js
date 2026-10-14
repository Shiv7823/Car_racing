// ============================================================================
// 2. CRISP ASPHALT TRACK, VIVID CURBS, WHITE BARRIERS & INSTANCED ARCHITECTURE
//    (trackMaterialsAndArchitecture.js — Total Scene Draw Calls < 40)
// ============================================================================
(function (global) {
  "use strict";

  function createCrispAsphaltTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#2a2d32";
    ctx.fillRect(0, 0, 256, 256);

    const imgData = ctx.getImageData(0, 0, 256, 256);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const grain = (Math.random() - 0.5) * 14;
      data[i]     = Math.min(255, Math.max(0, 42 + grain));
      data[i + 1] = Math.min(255, Math.max(0, 45 + grain));
      data[i + 2] = Math.min(255, Math.max(0, 50 + grain));
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(24, 24);
    return tex;
  }

  function createFuturisticTrackMaterials(envMap) {
    const asphaltTex = createCrispAsphaltTexture();

    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2d32,
      map: asphaltTex,
      roughness: 0.62,
      metalness: 0.12,
      envMap: envMap || null,
      envMapIntensity: 0.35
    });

    const curbMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.35,
      metalness: 0.10
    });

    const barrierMaterial = new THREE.MeshStandardMaterial({
      color: 0xf7faff,
      roughness: 0.25,
      metalness: 0.15,
      envMap: envMap || null,
      envMapIntensity: 0.5
    });

    const laneLineMaterial = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.DoubleSide
    });

    const palette = {
      asphalt: [0.165, 0.176, 0.196],
      curbVividOrangeRed: [1.0, 0.23, 0.10],
      curbCleanWhite: [0.99, 0.99, 1.0],
      barrierWhite: [0.96, 0.98, 1.0]
    };

    return { roadMaterial, curbMaterial, barrierMaterial, laneLineMaterial, palette };
  }

  function buildInstancedWhiteArchitecture(scene, trackSamples, barrierOffset, envMap) {
    const N = trackSamples.length;
    const dummy = new THREE.Object3D();

    const whiteArchMat = new THREE.MeshStandardMaterial({
      color: 0xf8fbff,
      roughness: 0.22,
      metalness: 0.16,
      envMap: envMap || null,
      envMapIntensity: 0.65
    });

    const archCount = 24;
    const spanW = barrierOffset * 2 + 2.4;
    const archGeo = new THREE.BoxGeometry(spanW, 0.75, 1.6);
    const archInst = new THREE.InstancedMesh(archGeo, whiteArchMat, archCount * 3);
    archInst.receiveShadow = true;
    let aCursor = 0;
    for (let i = 0; i < archCount; i++) {
      const sIdx = Math.floor((i / archCount) * N);
      const s = trackSamples[sIdx];
      const yaw = Math.atan2(s.tangent.x, s.tangent.z);
      dummy.position.set(s.pt.x, 8.8, s.pt.z);
      dummy.rotation.set(0, yaw, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      archInst.setMatrixAt(aCursor++, dummy.matrix);

      const pL = s.pt.clone().addScaledVector(s.right, -(barrierOffset + 1.1));
      dummy.position.set(pL.x, 4.4, pL.z);
      dummy.rotation.set(0, yaw, -0.08);
      dummy.scale.set(0.85 / spanW, 11.8, 0.9);
      dummy.updateMatrix();
      archInst.setMatrixAt(aCursor++, dummy.matrix);

      const pR = s.pt.clone().addScaledVector(s.right, barrierOffset + 1.1);
      dummy.position.set(pR.x, 4.4, pR.z);
      dummy.rotation.set(0, yaw, 0.08);
      dummy.scale.set(0.85 / spanW, 11.8, 0.9);
      dummy.updateMatrix();
      archInst.setMatrixAt(aCursor++, dummy.matrix);
    }
    scene.add(archInst);

    const standCount = 16;
    const standGeo = new THREE.BoxGeometry(10, 6.5, 22);
    const standInst = new THREE.InstancedMesh(standGeo, whiteArchMat, standCount);
    standInst.receiveShadow = true;
    for (let i = 0; i < standCount; i++) {
      const sIdx = Math.floor(((i + 0.5) / standCount) * N);
      const s = trackSamples[sIdx];
      const side = (i % 2 === 0) ? -1 : 1;
      const pos = s.pt.clone().addScaledVector(s.right, side * (barrierOffset + 14));
      const yaw = Math.atan2(s.tangent.x, s.tangent.z);
      dummy.position.set(pos.x, 3.25, pos.z);
      dummy.rotation.set(0, yaw, side * 0.14);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      standInst.setMatrixAt(i, dummy.matrix);
    }
    scene.add(standInst);

    const buildingCount = 60;
    const bGeo = new THREE.BoxGeometry(1, 1, 1);
    const buildingInst = new THREE.InstancedMesh(bGeo, whiteArchMat, buildingCount);
    buildingInst.receiveShadow = true;
    for (let i = 0; i < buildingCount; i++) {
      const sIdx = (i * 6) % N;
      const s = trackSamples[sIdx];
      const side = (i % 2 === 0) ? -1 : 1;
      const distOut = barrierOffset + 32 + ((i * 17) % 45);
      const pos = s.pt.clone().addScaledVector(s.right, side * distOut);
      const w = 12 + (i % 10);
      const h = 24 + ((i * 23) % 52);
      dummy.position.set(pos.x, h * 0.5, pos.z);
      dummy.rotation.set(0, (i % 4) * 0.25, 0);
      dummy.scale.set(w, h, w * 0.85);
      dummy.updateMatrix();
      buildingInst.setMatrixAt(i, dummy.matrix);
    }
    scene.add(buildingInst);

    return { archInst, standInst, buildingInst };
  }

  global.createFuturisticTrackMaterials = createFuturisticTrackMaterials;
  global.buildInstancedWhiteArchitecture = buildInstancedWhiteArchitecture;
})(window);
