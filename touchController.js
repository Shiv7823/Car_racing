// ============================================================================
// MOBILE MULTITOUCH CONTROLLER & GESTURE / ORIENTATION GUARD (touchController.js)
// ============================================================================
(function (global) {
  "use strict";

  class MobileTouchController {
    constructor(options = {}) {
      this.keyboardState = { forward: false, backward: false, left: false, right: false, drift: false, boost: false };
      this.touchState    = { forward: false, backward: false, left: false, right: false, drift: false, boost: false };
      this.keys          = { forward: false, backward: false, left: false, right: false, drift: false, boost: false };
      this.hitSlopPx     = options.hitSlopPx || 8;
      this.onCycleGfx    = options.onCycleGfx || (() => {});
      this.onResetCar    = options.onResetCar || (() => {});
      this.isLobbyActive = options.isLobbyActive || (() => false);

      this.ensureDOMOverlays();

      this.touchContainer = document.getElementById("touch-controls");
      this.orientationOverlay = document.getElementById("orientation-overlay");
      this.padElements = {
        left: document.getElementById("pad-left"),
        right: document.getElementById("pad-right"),
        forward: document.getElementById("pad-forward"),
        backward: document.getElementById("pad-backward"),
        drift: document.getElementById("pad-drift"),
        boost: document.getElementById("pad-boost")
      };
      this.controlButtonsList = Array.from(
        document.querySelectorAll("#touch-controls [data-control]")
      );

      this.lockDefaultTouchGestures();
      this.bindOrientationCheck();
      this.bindMultitouchEvents();
      this.bindKeyboardEvents();
    }

    ensureDOMOverlays() {
      if (!document.getElementById("orientation-overlay")) {
        const orientDiv = document.createElement("div");
        orientDiv.id = "orientation-overlay";
        orientDiv.innerHTML = `
          <svg class="rotate-phone-icon" viewBox="0 0 64 64" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <rect x="18" y="8" width="28" height="48" rx="5" />
            <line x1="29" y1="13" x2="35" y2="13" />
            <circle cx="32" cy="50" r="1.5" />
            <path d="M52 24 C57 29, 57 37, 52 42" />
            <polyline points="52 18 52 25 45 25" />
          </svg>
          <div class="orient-title">ROTATE TO LANDSCAPE</div>
          <div class="orient-sub">Please rotate your device horizontally for the thumb-friendly steering &amp; pedal layout.</div>
          <button class="orient-bypass-btn" onclick="document.getElementById('orientation-overlay').classList.add('dismissed')">Continue in Portrait</button>
        `;
        document.body.appendChild(orientDiv);
      }

      if (!document.getElementById("touch-controls")) {
        const tcDiv = document.createElement("div");
        tcDiv.id = "touch-controls";
        tcDiv.className = "visible";
        tcDiv.innerHTML = `
          <div class="touch-left-zone">
            <div class="steer-btn" id="pad-left" data-control="left">
              <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
              <small>STEER L</small>
            </div>
            <div class="steer-btn" id="pad-right" data-control="right">
              <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
              <small>STEER R</small>
            </div>
          </div>
          <div class="touch-right-zone">
            <div class="upper-boost-row">
              <div class="action-btn btn-drift" id="pad-drift" data-control="drift">
                <svg viewBox="0 0 24 24"><path d="M4 18c2-3 6-4 8-7s-1-5 2-8h3c-2 3 0 5-2 8s-6 4-8 7H4zm7 0c2-3 6-4 8-7s-1-5 2-8h2c-2 3 0 5-2 8s-6 4-8 7h-2z"/></svg>
                <small>DRIFT</small>
              </div>
              <div class="action-btn btn-nitro" id="pad-boost" data-control="boost">
                <svg viewBox="0 0 24 24"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/></svg>
                <small>NITRO</small>
              </div>
            </div>
            <div class="pedal-row">
              <div class="action-btn btn-brake" id="pad-backward" data-control="backward">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg>
                <small>BRAKE/REV</small>
              </div>
              <div class="action-btn btn-gas" id="pad-forward" data-control="forward">
                <svg viewBox="0 0 24 24"><path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2 3v3h6V6H9zm0 5v3h6v-3H9zm0 5v2h6v-2H9z"/></svg>
                <small>GAS PEDAL</small>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(tcDiv);
      }
    }

    lockDefaultTouchGestures() {
      window.addEventListener("contextmenu", (e) => {
        if (e.target.tagName !== "INPUT") e.preventDefault();
      });
      document.addEventListener("gesturestart", (e) => e.preventDefault(), { passive: false });
      document.addEventListener("gesturechange", (e) => e.preventDefault(), { passive: false });
      document.addEventListener("gestureend", (e) => e.preventDefault(), { passive: false });

      let lastTouchEndTime = 0;
      document.addEventListener(
        "touchend",
        (e) => {
          const now = performance.now();
          if (
            now - lastTouchEndTime <= 300 &&
            e.target.tagName !== "INPUT" &&
            e.target.tagName !== "BUTTON"
          ) {
            e.preventDefault();
          }
          lastTouchEndTime = now;
        },
        { passive: false }
      );
    }

    bindOrientationCheck() {
      const check = () => {
        if (!this.orientationOverlay) return;
        const isPortrait = window.innerHeight > window.innerWidth && window.innerWidth <= 920;
        if (!isPortrait) {
          this.orientationOverlay.classList.remove("dismissed");
        }
      };
      window.addEventListener("resize", check);
      window.addEventListener("orientationchange", check);
      check();
    }

    syncMergedControls() {
      for (const k of ["forward", "backward", "left", "right", "drift", "boost"]) {
        const active = !!(this.keyboardState[k] || this.touchState[k]);
        this.keys[k] = active;
        if (this.padElements[k]) {
          this.padElements[k].classList.toggle("pressed", active);
        }
      }
    }

    evaluateMultiTouchList(touchList) {
      this.touchState.forward = false;
      this.touchState.backward = false;
      this.touchState.left = false;
      this.touchState.right = false;
      this.touchState.drift = false;
      this.touchState.boost = false;

      const slop = this.hitSlopPx;
      for (let i = 0; i < touchList.length; i++) {
        const t = touchList[i];
        const x = t.clientX;
        const y = t.clientY;
        for (let b = 0; b < this.controlButtonsList.length; b++) {
          const btn = this.controlButtonsList[b];
          const rect = btn.getBoundingClientRect();
          if (
            x >= rect.left - slop &&
            x <= rect.right + slop &&
            y >= rect.top - slop &&
            y <= rect.bottom + slop
          ) {
            const ctrl = btn.dataset.control;
            if (ctrl in this.touchState) {
              this.touchState[ctrl] = true;
            }
          }
        }
      }
      this.syncMergedControls();
    }

    bindMultitouchEvents() {
      if (!this.touchContainer) return;

      const onTouch = (e) => {
        e.preventDefault();
        this.evaluateMultiTouchList(e.touches);
      };

      this.touchContainer.addEventListener("touchstart", onTouch, { passive: false });
      this.touchContainer.addEventListener("touchmove", onTouch, { passive: false });
      this.touchContainer.addEventListener("touchend", onTouch, { passive: false });
      this.touchContainer.addEventListener("touchcancel", onTouch, { passive: false });

      this.controlButtonsList.forEach((btn) => {
        const ctrl = btn.dataset.control;
        btn.addEventListener("mousedown", (e) => {
          e.preventDefault();
          this.touchState[ctrl] = true;
          this.syncMergedControls();
        });
        btn.addEventListener("mouseup", (e) => {
          e.preventDefault();
          this.touchState[ctrl] = false;
          this.syncMergedControls();
        });
        btn.addEventListener("mouseleave", () => {
          if (this.touchState[ctrl]) {
            this.touchState[ctrl] = false;
            this.syncMergedControls();
          }
        });
      });
    }

    bindKeyboardEvents() {
      const handleKey = (e, isDown) => {
        if (
          this.isLobbyActive() &&
          document.activeElement &&
          document.activeElement.tagName === "INPUT"
        ) {
          return;
        }

        const code = e.code || "";
        const keyLower = (e.key || "").toLowerCase();

        if (
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(code) ||
          ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(keyLower)
        ) {
          e.preventDefault();
        }

        if (code === "KeyW" || code === "ArrowUp" || keyLower === "w" || keyLower === "arrowup") {
          this.keyboardState.forward = isDown;
        } else if (code === "KeyS" || code === "ArrowDown" || keyLower === "s" || keyLower === "arrowdown") {
          this.keyboardState.backward = isDown;
        } else if (code === "KeyA" || code === "ArrowLeft" || keyLower === "a" || keyLower === "arrowleft") {
          this.keyboardState.left = isDown;
        } else if (code === "KeyD" || code === "ArrowRight" || keyLower === "d" || keyLower === "arrowright") {
          this.keyboardState.right = isDown;
        } else if (code === "Space" || keyLower === " ") {
          this.keyboardState.drift = isDown;
        } else if (code === "ShiftLeft" || code === "ShiftRight" || keyLower === "shift") {
          this.keyboardState.boost = isDown;
        } else if ((code === "KeyG" || keyLower === "g") && isDown) {
          this.onCycleGfx();
        } else if ((code === "KeyR" || keyLower === "r") && isDown) {
          this.onResetCar();
        }
        this.syncMergedControls();
      };

      window.addEventListener("keydown", (e) => handleKey(e, true), { passive: false });
      window.addEventListener("keyup", (e) => handleKey(e, false), { passive: false });
    }
  }

  global.MobileTouchController = MobileTouchController;
})(window);
