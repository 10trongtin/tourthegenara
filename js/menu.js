/**
 * menu.js
 * Solia Virtual Tour — Orange Luxury Navigation
 * Compact panel, premium aesthetic, minimal whitespace
 */

class SoliaMenu {
  constructor(orchestrator) {
    this.orch = orchestrator;
    this.activeGroupId = "tong_quan";
    this.currentScene = "";
    this.drawerOpen = false;
    this.sheetOpen = false;
    this.searchQuery = "";

    this.render();
  }

  render() {
    const uiContainer = this.orch.uiContainer;
    const rightOverlay = this.orch.rightOverlay;

    // 1. Left Panel for Desktop
    const leftPanelHTML = `
      <div id="solia-left-panel" class="solia-interactive">
        ${this.getPanelMarkup("desktop")}
      </div>
    `;
    uiContainer.insertAdjacentHTML('afterbegin', leftPanelHTML);

    // Floating Button to Reopen Left Panel
    const reopenBtnHTML = `
      <button id="solia-menu-reopen-btn" class="solia-m3-fab solia-m3-fab-sm solia-interactive" 
              onclick="SoliaUI.menu.toggleLeftMenu(false)" aria-label="Mở menu">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"
             stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    `;
    uiContainer.insertAdjacentHTML('afterbegin', reopenBtnHTML);

    // 2. Bottom Sheet for Mobile
    const bottomSheetHTML = `
      <div id="solia-bottom-sheet" class="solia-interactive">
        <div class="solia-sheet-handle-container" onclick="SoliaUI.menu.toggleSheet()">
          <div class="solia-sheet-handle"></div>
        </div>
        ${this.getPanelMarkup("mobile")}
      </div>
    `;
    uiContainer.insertAdjacentHTML('beforeend', bottomSheetHTML);

    // 3. Modal Navigation Drawer
    const modalDrawerHTML = `
      <div id="solia-modal-drawer" class="solia-interactive" onclick="SoliaUI.menu.toggleDrawer(false)">
        <div class="solia-drawer-content" onclick="event.stopPropagation()">
          <div class="solia-drawer-header">
            <span class="solia-drawer-brand">${SoliaConfig.tourTitle}</span>
            <button class="solia-menu-close-btn solia-interactive" onclick="SoliaUI.menu.toggleDrawer(false)">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="solia-m3-divider"></div>
          <div class="solia-drawer-body">
            ${this.renderDrawerLinks()}
          </div>
        </div>
      </div>
    `;
    uiContainer.insertAdjacentHTML('beforeend', modalDrawerHTML);

    // 4. FAB Button
    const fabHTML = `
      <div id="solia-fab-container">
        <button class="solia-m3-fab solia-interactive" onclick="SoliaUI.menu.openBookingDialog()">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" 
               fill="none" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Đặt lịch tham quan</span>
        </button>
      </div>
    `;
    rightOverlay.insertAdjacentHTML('beforeend', fabHTML);

    // 5. Booking Modal
    const bookingModalHTML = `
      <div id="solia-booking-modal" class="solia-interactive">
        <div class="solia-booking-card solia-interactive" onclick="event.stopPropagation()">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <h2 class="solia-booking-title">Đặt lịch tham quan</h2>
            <button class="solia-menu-close-btn solia-interactive" onclick="SoliaUI.menu.closeBookingDialog()">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <p style="font-size:var(--fs-xs); color:var(--md-sys-color-on-surface-variant); line-height:var(--lh-normal); margin-top:-4px;">
            Để lại thông tin, tư vấn viên sẽ liên hệ trong vòng 15 phút.
          </p>
          <div class="solia-booking-fields">
            <input type="text" placeholder="Họ và tên" id="book-name">
            <input type="tel" placeholder="Số điện thoại" id="book-phone">
          </div>
          <div class="solia-info-actions" style="margin-top:4px;">
            <button class="solia-btn-secondary solia-interactive" onclick="SoliaUI.menu.closeBookingDialog()">Hủy</button>
            <button class="solia-btn-primary solia-interactive" onclick="SoliaUI.menu.submitBooking()">Đăng ký ngay</button>
          </div>
        </div>
      </div>
    `;
    uiContainer.insertAdjacentHTML('beforeend', bookingModalHTML);

    // Close booking when clicking backdrop
    document.getElementById('solia-booking-modal').addEventListener('click', (e) => {
      if (e.target === document.getElementById('solia-booking-modal')) {
        this.closeBookingDialog();
      }
    });

    this.initEvents();
  }

  getPanelMarkup(platform) {
    return `
      <!-- Panel Header: Logo + Brand -->
      <div class="solia-panel-header">
        <img src="${SoliaConfig.logoUrl}" class="solia-panel-logo" alt="Logo" onerror="this.style.display='none'">
        <div class="solia-panel-brand">
          <span class="solia-panel-brand-name">${SoliaConfig.tourTitle}</span>
          <span class="solia-panel-brand-sub">Luxury Property Tour</span>
        </div>
        ${platform === 'desktop' ? `
          <button class="solia-panel-collapse-btn solia-interactive" onclick="event.stopPropagation(); SoliaUI.menu.toggleLeftMenu(true)" title="Thu gọn">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        ` : ''}
      </div>

      <!-- Search Bar -->
      <div class="solia-search-wrap">
        <div class="solia-m3-search-bar" ${platform === 'mobile' ? 'onclick="SoliaUI.menu.toggleSheet(true)"' : ''}>
          <button class="solia-m3-menu-btn solia-interactive" onclick="event.stopPropagation(); SoliaUI.menu.toggleDrawer(true)">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <input type="text" class="solia-m3-search-input solia-interactive search-input-${platform}" 
                 placeholder="Tìm kiếm điểm đến..." 
                 ${platform === 'mobile' ? 'onclick="event.stopPropagation()"' : ''}>
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" 
               style="color: var(--md-sys-color-on-surface-variant); flex-shrink:0;">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      <!-- Current Location -->
      <div class="solia-location-status" ${platform === 'mobile' ? 'onclick="SoliaUI.menu.toggleSheet()"' : ''}>
        <span class="solia-location-label">Đang xem</span>
        <h2 class="solia-location-title title-display-${platform}">Đang tải...</h2>
      </div>

      <!-- Category Chips -->
      <div class="solia-chips-wrap">
        <div class="solia-chips-scroll solia-m3-chip-row">
          ${this.renderChips(platform)}
        </div>
      </div>

      <div class="solia-m3-divider"></div>

      <!-- Scene List -->
      <div class="solia-list-wrap">
        <div class="solia-m3-list list-container-${platform}">
          <!-- Dynamic Items -->
        </div>
      </div>
    `;
  }

  renderChips(platform) {
    return SoliaConfig.menuGroups.map(group => `
      <button class="solia-m3-chip solia-interactive chip-${platform}-${group.id} ${group.id === this.activeGroupId ? 'active' : ''}" 
              onclick="event.stopPropagation(); SoliaUI.menu.setCategory('${group.id}')">
        ${group.title}
      </button>
    `).join('');
  }

  renderDrawerLinks() {
    return `
      <div style="display:flex; flex-direction:column; gap:var(--sp-2);">
        <button class="solia-m3-list-item solia-interactive" 
                onclick="window.open('${SoliaConfig.googleMapUrl}', '_blank')">
          <div class="solia-m3-item-icon-container">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.5" fill="none" 
                 style="color: var(--md-sys-color-primary);">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="solia-m3-item-content">
            <span class="solia-m3-item-title">Bản đồ vệ tinh</span>
            <span class="solia-m3-item-desc">Vị trí dự án trên Google Maps</span>
          </div>
          <svg class="solia-m3-item-chevron" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <button class="solia-m3-list-item solia-interactive" 
                onclick="window.open('${SoliaConfig.websiteUrl}', '_blank')">
          <div class="solia-m3-item-icon-container">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.5" fill="none"
                 style="color: var(--md-sys-color-primary);">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          <div class="solia-m3-item-content">
            <span class="solia-m3-item-title">Website Genera</span>
            <span class="solia-m3-item-desc">Bảng giá & chính sách mới nhất</span>
          </div>
          <svg class="solia-m3-item-chevron" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    `;
  }

  initEvents() {
    const searchDesktop = document.querySelector(".search-input-desktop");
    const searchMobile  = document.querySelector(".search-input-mobile");

    const handleSearch = (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      if (searchDesktop) searchDesktop.value = this.searchQuery;
      if (searchMobile)  searchMobile.value  = this.searchQuery;
      this.filterItems();
    };

    if (searchDesktop) searchDesktop.addEventListener('input', handleSearch);
    if (searchMobile)  searchMobile.addEventListener('input', handleSearch);

    this.updateLists();
  }

  getIconSvg(iconName) {
    const icons = {
      explore:            `<circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>`,
      photo_camera:       `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>`,
      door_front:         `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line>`,
      center_focus_strong:`<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle>`,
      apartment:          `<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="9" y1="16" x2="15" y2="16"></line>`,
      home:               `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>`,
      navigation:         `<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>`,
      pool:               `<path d="M2 12h20M2 16h20M2 20h20M12 4v4M12 8l4-4M12 8L8 4"></path>`,
      sports_soccer:      `<circle cx="12" cy="12" r="10"></circle><path d="M6.2 6.2L12 12m0 0l5.8 5.8M12 12L6.2 17.8M12 12l5.8-5.8"></path>`,
      forest:             `<path d="M12 2L2 22h20L12 2z"></path>`,
      nature_people:      `<circle cx="12" cy="4" r="2"></circle><path d="M7 22v-3l3-3 2 4 2-4 3 3v3"></path>`,
    };
    return icons[iconName] || `<circle cx="12" cy="12" r="10"></circle>`;
  }

  setCategory(groupId) {
    this.activeGroupId = groupId;

    document.querySelectorAll(".solia-m3-chip").forEach(chip => {
      const isTarget = chip.classList.contains(`chip-desktop-${groupId}`) ||
                       chip.classList.contains(`chip-mobile-${groupId}`);
      chip.classList.toggle("active", isTarget);
    });

    this.updateLists();
  }

  updateLists() {
    const activeGroup = SoliaConfig.menuGroups.find(g => g.id === this.activeGroupId);
    if (!activeGroup) return;

    const filteredItems = activeGroup.items.filter(item =>
      item.title.toLowerCase().includes(this.searchQuery)
    );

    const listHTML = filteredItems.map(item => {
      const isActive = item.name === this.currentScene;
      const baseUrl  = SoliaConfig.panoBaseUrl ? SoliaConfig.panoBaseUrl.replace(/\/$/, '') : '';
      const thumb    = `${baseUrl}/panos/${item.name.replace('scene_', '')}.tiles/thumb.jpg`;
      const desc     = SoliaConfig.sceneDetails[item.name]?.description?.substring(0, 80) + '…' || "";

      return `
        <button class="solia-m3-list-item solia-interactive solia-m3-state ${isActive ? 'active' : ''}" 
                onclick="event.stopPropagation(); SoliaUI.menu.selectScene('${item.name}')">
          <div class="solia-m3-item-icon-container">
            <img src="${thumb}" alt="${item.title}" onerror="this.src='skin/vtourskin.png'">
          </div>
          <div class="solia-m3-item-content">
            <span class="solia-m3-item-title">${item.title}</span>
            <span class="solia-m3-item-desc">${desc}</span>
          </div>
          <svg class="solia-m3-item-chevron" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      `;
    }).join('');

    const destList = document.querySelector(".list-container-desktop");
    const mobList  = document.querySelector(".list-container-mobile");

    if (destList) destList.innerHTML = listHTML;
    if (mobList)  mobList.innerHTML  = listHTML;
  }

  filterItems() {
    this.updateLists();
  }

  selectScene(sceneName) {
    if (this.orch.krpano) {
      this.orch.krpano.call(`skin_loadscene(${sceneName}, get(skin_settings.loadscene_blend))`);
      if (window.innerWidth <= 768) {
        this.toggleSheet(false);
      }
    }
  }

  setActiveScene(sceneName) {
    this.currentScene = sceneName;

    const title = this.orch.krpano
      ? this.orch.krpano.get(`scene[${sceneName}].title`)
      : sceneName;

    const titleDesktop = document.querySelector(".title-display-desktop");
    const titleMobile  = document.querySelector(".title-display-mobile");
    if (titleDesktop) titleDesktop.textContent = title;
    if (titleMobile)  titleMobile.textContent  = title;

    let currentGroupId = null;
    SoliaConfig.menuGroups.forEach(g => {
      if (g.items.some(item => item.name === sceneName)) currentGroupId = g.id;
    });

    if (currentGroupId && currentGroupId !== this.activeGroupId) {
      this.setCategory(currentGroupId);
    } else {
      this.updateLists();
    }
  }

  toggleDrawer(forceState) {
    this.drawerOpen = forceState !== undefined ? forceState : !this.drawerOpen;
    const el = document.getElementById("solia-modal-drawer");
    el.classList.toggle("open", this.drawerOpen);
  }

  toggleSheet(forceState) {
    this.sheetOpen = forceState !== undefined ? forceState : !this.sheetOpen;
    const el = document.getElementById("solia-bottom-sheet");
    el.classList.toggle("open", this.sheetOpen);
  }

  toggleLeftMenu(forceState) {
    const uiContainer = document.getElementById("solia-ui");
    if (!uiContainer) return;

    if (forceState === true) {
      uiContainer.classList.add("menu-collapsed");
    } else if (forceState === false) {
      uiContainer.classList.remove("menu-collapsed");
    } else {
      uiContainer.classList.toggle("menu-collapsed");
    }
  }

  openBookingDialog() {
    document.getElementById("solia-booking-modal").classList.add("open");
  }

  closeBookingDialog() {
    document.getElementById("solia-booking-modal").classList.remove("open");
  }

  submitBooking() {
    const name  = document.getElementById("book-name").value.trim();
    const phone = document.getElementById("book-phone").value.trim();
    if (!name || !phone) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    alert(`Cảm ơn ${name}! Tư vấn viên sẽ gọi điện cho bạn sớm nhất.`);
    this.closeBookingDialog();
    document.getElementById("book-name").value  = "";
    document.getElementById("book-phone").value = "";
  }
}

window.SoliaMenu = SoliaMenu;
