/**
 * toolbar.js
 * Solia Virtual Tour — Orange Luxury Design System
 * Floating Toolbar Dock & Floorplan Drawer
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
      <div id="solia-toolbar" class="solia-glass solia-interactive">
        <!-- Toggle Menu Drawer -->
        <button class="solia-toolbar-btn solia-interactive" onclick="SoliaUI.menu.toggle()" aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          <span class="solia-tooltip">Menu</span>
        </button>

        <div class="solia-toolbar-divider"></div>

        <!-- Home / Reset Scene -->
        <button class="solia-toolbar-btn solia-interactive" onclick="SoliaUI.toolbar.goHome()" aria-label="Go home">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          <span class="solia-tooltip">Trang chủ</span>
        </button>

        <!-- Toggle Map -->
        <button class="solia-toolbar-btn solia-interactive" id="btn-minimap" onclick="SoliaUI.toolbar.toggleMinimap()" aria-label="Toggle map">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon></svg>
          <span class="solia-tooltip">Bản đồ</span>
        </button>

        <!-- Floor Plan -->
        <button class="solia-toolbar-btn solia-interactive" id="btn-floorplan" onclick="SoliaUI.toolbar.toggleFloorplan()" aria-label="Floor plan">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line></svg>
          <span class="solia-tooltip">Mặt bằng</span>
        </button>

        <!-- Auto Rotate -->
        <button class="solia-toolbar-btn solia-interactive" id="btn-rotate" onclick="SoliaUI.toolbar.toggleAutoRotate()" aria-label="Auto rotate">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
          <span class="solia-tooltip">Tự xoay</span>
        </button>

        <!-- VR Mode -->
        <button class="solia-toolbar-btn solia-interactive" onclick="SoliaUI.toolbar.enterVR()" aria-label="Enter VR">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect><circle cx="6.5" cy="12" r="1.5"></circle><circle cx="17.5" cy="12" r="1.5"></circle><path d="M12 7v2"></path></svg>
          <span class="solia-tooltip">Chế độ VR</span>
        </button>

        <!-- Info Card Popup -->
        <button class="solia-toolbar-btn solia-interactive" onclick="SoliaUI.showInfoModal(SoliaUI.currentScene)" aria-label="Information">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span class="solia-tooltip">Thông tin</span>
        </button>

        <!-- Reset View -->
        <button class="solia-toolbar-btn solia-interactive" onclick="SoliaUI.toolbar.resetView()" aria-label="Reset view">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path></svg>
          <span class="solia-tooltip">Đặt lại góc nhìn</span>
        </button>

        <!-- Fullscreen -->
        <button class="solia-toolbar-btn solia-interactive" onclick="SoliaUI.toolbar.toggleFullscreen()" aria-label="Fullscreen">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
          <span class="solia-tooltip">Toàn màn hình</span>
        </button>
      </div>

      <!-- MAP MODAL -->
      <div id="solia-minimap-container" style="display: none;">
        <iframe id="solia-minimap-iframe" src="${SoliaConfig.googleMapUrl}" allowfullscreen></iframe>
      </div>
    `;

    this.orch.uiContainer.insertAdjacentHTML('beforeend', toolbarHTML);
    this.minimapContainer = document.getElementById("solia-minimap-container");
  }

  goHome() {
    if (this.orch.krpano) {
      this.orch.krpano.call("loadscene(0, null, MERGE, BLEND(1.0))");
    }
  }

  toggleMinimap() {
    this.minimapActive = !this.minimapActive;
    const btn = document.getElementById("btn-minimap");
    if (this.minimapActive) {
      btn.classList.add("active");
      this.minimapContainer.style.display = "block";
      this.minimapContainer.classList.add("animate-scale-up");
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

  resetView() {
    if (this.orch.krpano) {
      this.orch.krpano.call("skin_view_normal()");
    }
  }

  toggleFullscreen() {
    if (this.orch.krpano) {
      this.orch.krpano.call("switch(fullscreen)");
    }
  }
}

/**
 * Floorplan Drawer Component
 */
class SoliaFloorplan {
  constructor(orchestrator) {
    this.orch = orchestrator;
    this.isOpen = false;
    this.render();
  }

  render() {
    // Generate a flat list of scenes from Config groups
    const flatScenes = [];
    SoliaConfig.menuGroups.forEach(g => {
      g.items.forEach(item => {
        flatScenes.push({
          name: item.name,
          title: item.title,
          thumb: `panos/${item.name.replace('scene_', '')}.tiles/thumb.jpg`
        });
      });
    });

    const floorplanHTML = `
      <div id="solia-floorplan-drawer" class="solia-glass solia-interactive">
        <div class="solia-floorplan-header">
          <h3 class="solia-title" style="font-size: var(--fs-md);">Sơ đồ phân khu / Mặt bằng</h3>
          <button class="solia-menu-close-btn solia-interactive" onclick="SoliaUI.toolbar.floorplan.toggle(false)" aria-label="Close floorplan">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="solia-floorplan-body solia-scroll">
          <p class="solia-subtitle" style="font-size: var(--fs-sm); margin-bottom: var(--sp-4);">Chọn khu vực hoặc điểm quan sát từ sơ đồ bên dưới:</p>
          
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

    this.orch.uiContainer.insertAdjacentHTML('beforeend', floorplanHTML);
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
