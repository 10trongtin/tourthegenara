/**
 * toolbar.js
 * Solia Virtual Tour — Material Design 3 Utility Dock & Floorplan Drawer
 */

class SoliaToolbar {
  constructor(orchestrator) {
    this.orch = orchestrator;
    this.autoRotateActive = false;
    this.minimapActive = false;
    this.render();
    this.floorplan = new SoliaFloorplan(this.orch);
  }

  render() {
    const toolbarHTML = `
      <!-- M3 Style Floating Utility Dock — positioned via CSS in right-overlay -->
      <div id="solia-toolbar" class="solia-interactive">
        
        <!-- Toggle Map -->
        <button class="solia-toolbar-btn solia-m3-state solia-interactive" id="btn-minimap" onclick="SoliaUI.toolbar.toggleMinimap()" aria-label="Toggle map">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon></svg>
          <span class="solia-tooltip">Bản đồ</span>
        </button>

        <!-- Floor Plan -->
        <button class="solia-toolbar-btn solia-m3-state solia-interactive" id="btn-floorplan" onclick="SoliaUI.toolbar.toggleFloorplan()" aria-label="Floor plan">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line></svg>
          <span class="solia-tooltip">Mặt bằng</span>
        </button>

        <!-- Auto Rotate -->
        <button class="solia-toolbar-btn solia-m3-state solia-interactive" id="btn-rotate" onclick="SoliaUI.toolbar.toggleAutoRotate()" aria-label="Auto rotate">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
          <span class="solia-tooltip">Tự xoay</span>
        </button>

        <!-- VR Mode -->
        <button class="solia-toolbar-btn solia-m3-state solia-interactive" onclick="SoliaUI.toolbar.enterVR()" aria-label="Enter VR">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect><circle cx="6.5" cy="12" r="1.5"></circle><circle cx="17.5" cy="12" r="1.5"></circle><path d="M12 7v2"></path></svg>
          <span class="solia-tooltip">Chế độ VR</span>
        </button>

        <!-- Info Card Popup -->
        <button class="solia-toolbar-btn solia-m3-state solia-interactive" onclick="SoliaUI.showInfoModal(SoliaUI.currentScene)" aria-label="Information">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span class="solia-tooltip">Thông tin điểm</span>
        </button>

        <div class="solia-toolbar-divider"></div>

        <!-- Fullscreen -->
        <button class="solia-toolbar-btn solia-m3-state solia-interactive" onclick="SoliaUI.toolbar.toggleFullscreen()" aria-label="Fullscreen">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
          <span class="solia-tooltip">Toàn màn hình</span>
        </button>
      </div>

      <!-- MAP MODAL (Optimized with placeholder for lazy-loading) -->
      <div id="solia-minimap-container" style="display: none;">
        <div id="solia-minimap-placeholder" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: var(--md-sys-color-surface-container); color: var(--md-sys-color-on-surface-variant); font-size: var(--fs-sm);">Đang tải bản đồ...</div>
      </div>
    `;

    // Inject toolbar into rightOverlay so absolute positioning works correctly
    this.orch.rightOverlay.insertAdjacentHTML('afterbegin', toolbarHTML);
    this.minimapContainer = document.getElementById("solia-minimap-container");
  }

  toggleMinimap() {
    this.minimapActive = !this.minimapActive;
    const btn = document.getElementById("btn-minimap");
    if (this.minimapActive) {
      btn.classList.add("active");
      this.minimapContainer.style.display = "block";
      this.minimapContainer.classList.add("animate-scale-up");
      
      // Lazy-load the heavy Google Map iframe on demand (speed optimization)
      const placeholder = document.getElementById("solia-minimap-placeholder");
      if (placeholder) {
        placeholder.outerHTML = `<iframe id="solia-minimap-iframe" src="${SoliaConfig.googleMapUrl}" allowfullscreen style="width: 100%; height: 100%; border: none;"></iframe>`;
      }
    } else {
      btn.classList.remove("active");
      this.minimapContainer.style.display = "none";
    }
  }

  toggleFloorplan() {
    this.floorplan.toggle();
  }

  toggleAutoRotate() {
    this.autoRotateActive = !this.autoRotateActive;
    const btn = document.getElementById("btn-rotate");
    if (this.orch.krpano) {
      if (this.autoRotateActive) {
        btn.classList.add("active");
        this.orch.krpano.call("autorotate.start()");
      } else {
        btn.classList.remove("active");
        this.orch.krpano.call("autorotate.stop()");
      }
    }
  }

  enterVR() {
    if (this.orch.krpano) {
      this.orch.krpano.call("webvr.enterVR()");
    }
  }

  toggleFullscreen() {
    if (this.orch.krpano) {
      this.orch.krpano.call("switch(fullscreen)");
    }
  }
}

/**
 * M3 Style Floorplan Drawer Component
 */
class SoliaFloorplan {
  constructor(orchestrator) {
    this.orch = orchestrator;
    this.isOpen = false;
    this.render();
  }

  render() {
    const flatScenes = [];
    const baseUrl = SoliaConfig.panoBaseUrl ? SoliaConfig.panoBaseUrl.replace(/\/$/, '') : '';
    SoliaConfig.menuGroups.forEach(g => {
      g.items.forEach(item => {
        flatScenes.push({
          name: item.name,
          title: item.title,
          thumb: `${baseUrl}/panos/${item.name.replace('scene_', '')}.tiles/thumb.jpg`
        });
      });
    });

    const floorplanHTML = `
      <div id="solia-floorplan-drawer" class="solia-interactive" style="background-color: var(--md-sys-color-surface-container); border-radius: var(--md-shape-corner-medium); border: 1px solid var(--md-sys-color-outline);">
        <div class="solia-floorplan-header">
          <h3 class="solia-title" style="font-size: var(--fs-md); font-family: var(--font-family-serif);">Sơ đồ mặt bằng</h3>
          <button class="solia-menu-close-btn solia-interactive" onclick="SoliaUI.toolbar.floorplan.toggle(false)" aria-label="Close floorplan">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="solia-floorplan-body solia-scroll-y">
          <div class="solia-floorplan-thumb-container">
            ${flatScenes.map(sc => `
              <div class="solia-floorplan-thumb solia-interactive" data-scene="${sc.name}" title="${sc.title}">
                <img src="${sc.thumb}" alt="${sc.title}" onerror="this.src='skin/vtourskin.png'">
                <div class="solia-floorplan-thumb-title">${sc.title}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Inject floorplan drawer into rightOverlay so absolute positioning works correctly
    this.orch.rightOverlay.insertAdjacentHTML('beforeend', floorplanHTML);
    this.drawerEl = document.getElementById("solia-floorplan-drawer");

    this.initEvents();
  }

  initEvents() {
    this.drawerEl.querySelectorAll(".solia-floorplan-thumb").forEach(thumb => {
      thumb.addEventListener('click', () => {
        const sceneName = thumb.getAttribute("data-scene");
        if (this.orch.krpano) {
          this.orch.krpano.call(`skin_loadscene(${sceneName}, get(skin_settings.loadscene_blend))`);
          if (window.innerWidth <= 768) {
            this.toggle(false);
          }
        }
      });
    });
  }

  toggle(forceState) {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    const btn = document.getElementById("btn-floorplan");
    if (this.isOpen) {
      this.drawerEl.classList.add("open");
      btn.classList.add("active");
    } else {
      this.drawerEl.classList.remove("open");
      btn.classList.remove("active");
    }
  }

  setActiveScene(sceneName) {
    this.drawerEl.querySelectorAll(".solia-floorplan-thumb").forEach(thumb => {
      if (thumb.getAttribute("data-scene") === sceneName) {
        thumb.classList.add("active");
      } else {
        thumb.classList.remove("active");
      }
    });
  }
}

window.SoliaToolbar = SoliaToolbar;
