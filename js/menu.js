/**
 * menu.js
 * Solia Virtual Tour — Orange Luxury Design System
 * Grouped Navigation Menu Drawer & Search filter
 */

class SoliaMenu {
  constructor(orchestrator) {
    this.orch = orchestrator;
    this.isOpen = false;
    this.render();
  }

  render() {
    const menuHTML = `
      <div id="solia-menu-drawer" class="solia-glass solia-interactive">
        <div class="solia-menu-header">
          <img src="${SoliaConfig.logoUrl}" class="solia-menu-logo-img" alt="Solia Logo" onerror="this.style.display='none'">
          <button class="solia-menu-close-btn solia-interactive" onclick="SoliaUI.menu.toggle(false)" aria-label="Close menu">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="solia-menu-search-container">
          <div class="solia-menu-search-wrapper">
            <svg class="solia-menu-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" class="solia-menu-search-input solia-interactive" placeholder="Tìm kiếm địa điểm..." id="solia-menu-search">
          </div>
        </div>
        <div class="solia-menu-content solia-scroll">
          ${this.renderGroups()}
        </div>
      </div>
    `;

    this.orch.uiContainer.insertAdjacentHTML('beforeend', menuHTML);
    this.drawerEl = document.getElementById("solia-menu-drawer");
    this.searchEl = document.getElementById("solia-menu-search");

    this.initEvents();
  }

  renderGroups() {
    return SoliaConfig.menuGroups.map(group => `
      <div class="solia-menu-group" data-group-id="${group.id}">
        <div class="solia-menu-group-header">
          <span>${group.title}</span>
        </div>
        <div class="solia-menu-group-items">
          ${group.items.map(item => `
            <button class="solia-menu-item solia-interactive" data-scene="${item.name}">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                ${this.getIconSvg(item.icon)}
              </svg>
              <span>${item.title}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `).join('') + `
      <div class="solia-menu-group">
        <div class="solia-menu-group-header">🌐 Tiện ích mở rộng</div>
        <button class="solia-menu-item solia-interactive" onclick="window.open('${SoliaConfig.googleMapUrl}', '_blank')">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>Bản đồ Google Map</span>
        </button>
        <button class="solia-menu-item solia-interactive" onclick="window.open('${SoliaConfig.websiteUrl}', '_blank')">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          <span>Trang chủ Solia</span>
        </button>
      </div>
    `;
  }

  // Material symbols / Feather equivalents
  getIconSvg(iconName) {
    switch(iconName) {
      case "explore":
        return `<circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>`;
      case "photo_camera":
        return `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>`;
      case "door_front":
        return `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line>`;
      case "center_focus_strong":
        return `<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle>`;
      case "apartment":
        return `<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="9" y1="16" x2="15" y2="16"></line><path d="M8 6h2v2H8V6zm4 0h2v2h-2V6zm-4 4h2v2H8v-2zm4 0h2v2h-2v-2z"></path>`;
      case "home":
        return `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>`;
      case "navigation":
        return `<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>`;
      case "pool":
        return `<path d="M2 12h20M2 16h20M2 20h20M12 4v4M12 8l4-4M12 8L8 4"></path>`;
      case "sports_soccer":
        return `<circle cx="12" cy="12" r="10"></circle><path d="M6.2 6.2L12 12m0 0l5.8 5.8M12 12L6.2 17.8M12 12l5.8-5.8"></path>`;
      case "forest":
        return `<path d="M12 2L2 22h20L12 2z"></path>`;
      default:
        return `<circle cx="12" cy="12" r="10"></circle>`;
    }
  }

  initEvents() {
    // Click menu items to switch scene
    this.drawerEl.querySelectorAll(".solia-menu-item[data-scene]").forEach(item => {
      item.addEventListener('click', () => {
        const sceneName = item.getAttribute("data-scene");
        if (this.orch.krpano) {
          this.orch.krpano.call(`skin_loadscene(${sceneName}, get(skin_settings.loadscene_blend))`);
          // Close menu on mobile after choosing
          if (window.innerWidth <= 768) {
            this.toggle(false);
          }
        }
      });
    });

    // Real-time search filter
    this.searchEl.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      this.filterItems(query);
    });
  }

  filterItems(query) {
    const groups = this.drawerEl.querySelectorAll(".solia-menu-group");
    groups.forEach(group => {
      const items = group.querySelectorAll(".solia-menu-item[data-scene]");
      let hasVisible = false;

      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = "flex";
          hasVisible = true;
        } else {
          item.style.display = "none";
        }
      });

      // Hide group header if no items inside are visible
      const header = group.querySelector(".solia-menu-group-header");
      if (header) {
        header.style.display = hasVisible ? "flex" : "none";
      }
    });
  }

  toggle(forceState) {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    if (this.isOpen) {
      this.drawerEl.classList.add("open");
      // Focus search box automatically for optimal keyboard flow
      setTimeout(() => this.searchEl.focus(), 250);
    } else {
      this.drawerEl.classList.remove("open");
    }
  }

  setActiveScene(sceneName) {
    this.drawerEl.querySelectorAll(".solia-menu-item").forEach(item => {
      if (item.getAttribute("data-scene") === sceneName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }
}
window.SoliaMenu = SoliaMenu;
