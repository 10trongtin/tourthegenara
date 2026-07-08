/**
 * menu.js
 * Solia Virtual Tour — Orange/Gold Luxury Design System
 * Grouped Navigation Menu Drawer (Accordion, Clean Typography, Footer Utilities)
 */

class SoliaMenu {
  constructor(orchestrator) {
    this.orch = orchestrator;
    this.isOpen = false;
    this.activeGroupId = "tong_quan"; // Default expanded group
    this.render();
  }

  render() {
    const menuHTML = `
      <div id="solia-menu-drawer" class="solia-glass solia-interactive">
        <div class="solia-menu-header-wrapper">
          <!-- Premium Serif Branding Header -->
          <div class="solia-menu-brand">
            <span class="solia-brand-collection">COLLECTION</span>
            <h1 class="solia-brand-name">Genera</h1>
            <span class="solia-brand-by">BY THE SOLIA</span>
          </div>
          
          <button class="solia-menu-close-btn solia-interactive" onclick="SoliaUI.menu.toggle(false)" aria-label="Close menu">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Search input box -->
        <div class="solia-menu-search-container">
          <div class="solia-menu-search-wrapper">
            <input type="text" class="solia-menu-search-input solia-interactive" placeholder="Tìm kiếm địa điểm..." id="solia-menu-search">
          </div>
        </div>

        <!-- Accordion Menu Content -->
        <div class="solia-menu-content solia-scroll">
          ${this.renderGroups()}
        </div>

        <!-- Footer Utilities (Google Maps and Website links as small footers) -->
        <div class="solia-menu-footer">
          <button class="solia-menu-footer-btn solia-interactive" onclick="window.open('${SoliaConfig.googleMapUrl}', '_blank')" aria-label="Google Maps">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </button>
          <button class="solia-menu-footer-btn solia-interactive" onclick="window.open('${SoliaConfig.websiteUrl}', '_blank')" aria-label="Solia Homepage">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="1.5" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          </button>
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
      <div class="solia-menu-group collapsed" data-group-id="${group.id}" id="group-${group.id}">
        <div class="solia-menu-group-header solia-interactive" onclick="SoliaUI.menu.toggleGroup('${group.id}')">
          <span>${group.title}</span>
          <svg class="solia-chevron-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <div class="solia-menu-group-items">
          ${group.items.map(item => `
            <button class="solia-menu-item solia-interactive" data-scene="${item.name}">
              <span class="solia-item-bullet"></span>
              <span class="solia-item-title">${item.title}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `).join('');
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

      // Show/expand group if it contains matching search items
      if (query !== "") {
        if (hasVisible) {
          group.classList.remove("collapsed");
          group.style.display = "block";
        } else {
          group.style.display = "none";
        }
      } else {
        // Reset to normal accordion behavior when query is empty
        group.style.display = "block";
        if (group.getAttribute("data-group-id") === this.activeGroupId) {
          group.classList.remove("collapsed");
        } else {
          group.classList.add("collapsed");
        }
      }
    });
  }

  // Accordion Toggle Group
  toggleGroup(groupId) {
    // If it is already open, collapse it
    if (this.activeGroupId === groupId) {
      const el = document.getElementById(`group-${groupId}`);
      if (el) {
        el.classList.toggle("collapsed");
      }
      return;
    }

    // Collapse currently active group
    if (this.activeGroupId) {
      const prevEl = document.getElementById(`group-${this.activeGroupId}`);
      if (prevEl) prevEl.classList.add("collapsed");
    }

    // Expand the selected group
    this.activeGroupId = groupId;
    const currentEl = document.getElementById(`group-${groupId}`);
    if (currentEl) currentEl.classList.remove("collapsed");
  }

  toggle(forceState) {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    if (this.isOpen) {
      this.drawerEl.classList.add("open");
      setTimeout(() => this.searchEl.focus(), 250);
    } else {
      this.drawerEl.classList.remove("open");
    }
  }

  setActiveScene(sceneName) {
    let targetGroupId = null;

    this.drawerEl.querySelectorAll(".solia-menu-item").forEach(item => {
      if (item.getAttribute("data-scene") === sceneName) {
        item.classList.add("active");
        // Find which group this active scene belongs to
        const parentGroup = item.closest(".solia-menu-group");
        if (parentGroup) {
          targetGroupId = parentGroup.getAttribute("data-group-id");
        }
      } else {
        item.classList.remove("active");
      }
    });

    // Auto expand the group containing the active scene on scene change
    if (targetGroupId && targetGroupId !== this.activeGroupId) {
      this.toggleGroup(targetGroupId);
    }
  }
}

window.SoliaMenu = SoliaMenu;
