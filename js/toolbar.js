/**
 * toolbar.js — GENERA Virtual Tour
 * Luxury Minimal UI Toolbar
 * Grouped controls, distinct spacing, tooltips
 */

class SoliaToolbar {
  constructor(orchestrator) {
    this.orch = orchestrator;
    this.isFullscreen = false;
    this.isMuted = false;
    this.isAutorotate = false;
    
    this.floorplan = new SoliaFloorplan(this.orch);
    
    this.render();
  }

  render() {
    const container = this.orch.uiContainer;
    
    // Yêu cầu: Nhóm các biểu tượng điều khiển góc trên phải theo chức năng, 
    // có khoảng cách rõ giữa các nhóm, thêm chú thích khi rê chuột
    const toolbarHTML = `
      <div id="solia-toolbar">
        
        <!-- Nhóm 1: Điều khiển hiển thị / Tương tác không gian -->
        <div class="solia-toolbar-group">
          <button class="solia-toolbar-btn solia-interactive" onclick="SoliaUI.toolbar.toggleFloorplan()" aria-label="Sơ đồ mặt bằng">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            <span class="solia-tooltip">Sơ đồ mặt bằng</span>
          </button>
          
          <button class="solia-toolbar-btn solia-interactive" id="btn-autorotate" onclick="SoliaUI.toolbar.toggleAutorotate()" aria-label="Tự động xoay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6M2.13 15.57a10 10 0 1 0 1.49-8.4L21.5 8"></path>
            </svg>
            <span class="solia-tooltip">Tự động xoay</span>
          </button>
        </div>

        <!-- Nhóm 2: Media & System -->
        <div class="solia-toolbar-group">
          <button class="solia-toolbar-btn solia-interactive" id="btn-sound" onclick="SoliaUI.toolbar.toggleSound()" aria-label="Âm thanh">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span class="solia-tooltip">Bật/Tắt âm thanh</span>
          </button>
          
          <button class="solia-toolbar-btn solia-interactive" id="btn-fullscreen" onclick="SoliaUI.toolbar.toggleFullscreen()" aria-label="Toàn màn hình">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
            <span class="solia-tooltip">Toàn màn hình</span>
          </button>
        </div>
        
      </div>
    `;
    
    container.insertAdjacentHTML('beforeend', toolbarHTML);
  }

  toggleFloorplan() {
    this.floorplan.toggle();
  }

  toggleAutorotate() {
    this.isAutorotate = !this.isAutorotate;
    const btn = document.getElementById("btn-autorotate");
    btn.classList.toggle("active", this.isAutorotate);
    
    if (this.orch.krpano) {
      if (this.isAutorotate) {
        this.orch.krpano.set("autorotate.enabled", true);
      } else {
        this.orch.krpano.set("autorotate.enabled", false);
      }
    }
  }

  toggleSound() {
    this.isMuted = !this.isMuted;
    const btn = document.getElementById("btn-sound");
    btn.classList.toggle("active", this.isMuted);
    
    const svg = btn.querySelector("svg");
    if (this.isMuted) {
      svg.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      `;
      btn.querySelector(".solia-tooltip").textContent = "Bật âm thanh";
    } else {
      svg.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      `;
      btn.querySelector(".solia-tooltip").textContent = "Tắt âm thanh";
    }
    
    if (this.orch.krpano) {
      // Implement krpano sound toggling here
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      this.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.isFullscreen = false;
    }
    
    const btn = document.getElementById("btn-fullscreen");
    const svg = btn.querySelector("svg");
    
    if (this.isFullscreen) {
      svg.innerHTML = `
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
      `;
      btn.querySelector(".solia-tooltip").textContent = "Thoát toàn màn hình";
    } else {
      svg.innerHTML = `
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
      `;
      btn.querySelector(".solia-tooltip").textContent = "Toàn màn hình";
    }
  }
}

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
      <div id="solia-floorplan-drawer" class="solia-interactive">
        <div class="solia-floorplan-header">
          <h3 class="solia-floorplan-title">Sơ đồ mặt bằng</h3>
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
    if (this.isOpen) {
      this.drawerEl.classList.add("open");
    } else {
      this.drawerEl.classList.remove("open");
    }
  }

  setActiveScene(sceneName) {
    if (!this.drawerEl) return;
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
