/**
 * menu.js
 * Solia Virtual Tour — Material Design 3 Navigation Journey
 * Orchestrates search, chips, list views, modal drawer, bottom sheet, and FAB.
 */

class SoliaMenu {
  constructor(orchestrator) {
    this.orch = orchestrator;
    this.activeGroupId = "tong_quan"; // Current filter category
    this.currentScene = "";
    this.drawerOpen = false;
    this.sheetOpen = false;
    this.searchQuery = "";

    this.render();
  }

  render() {
    const uiContainer = this.orch.uiContainer;
    const rightOverlay = this.orch.rightOverlay;

    // 1. Inject Left Panel for Desktop — insert BEFORE the right-overlay so it lands in grid col 1
    const leftPanelHTML = `
      <div id="solia-left-panel" class="solia-interactive">
        ${this.getPanelMarkup("desktop")}
      </div>
    `;
    uiContainer.insertAdjacentHTML('afterbegin', leftPanelHTML);

    // Floating Button to Reopen Left Panel (only visible when collapsed)
    const reopenBtnHTML = `
      <button id="solia-menu-reopen-btn" class="solia-m3-fab solia-interactive" onclick="SoliaUI.menu.toggleLeftMenu(false)" aria-label="Open menu">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    `;
    uiContainer.insertAdjacentHTML('afterbegin', reopenBtnHTML);

    // 2. Inject Bottom Sheet for Mobile — goes into main ui container (fixed to viewport bottom)
    const bottomSheetHTML = `
      <div id="solia-bottom-sheet" class="solia-interactive">
        <div class="solia-sheet-handle-container" onclick="SoliaUI.menu.toggleSheet()">
          <div class="solia-sheet-handle"></div>
        </div>
        ${this.getPanelMarkup("mobile")}
      </div>
    `;
    uiContainer.insertAdjacentHTML('beforeend', bottomSheetHTML);

    // 3. Inject Modal Navigation Drawer — into uiContainer (full-screen overlay)
    const modalDrawerHTML = `
      <div id="solia-modal-drawer" class="solia-interactive" onclick="SoliaUI.menu.toggleDrawer(false)">
        <div class="solia-drawer-content" onclick="event.stopPropagation()">
          <div class="solia-drawer-header">
            <h2 class="solia-drawer-brand" style="font-family: var(--font-family-serif); color: var(--md-sys-color-primary);">${SoliaConfig.tourTitle}</h2>
            <button class="solia-menu-close-btn solia-interactive" onclick="SoliaUI.menu.toggleDrawer(false)">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="solia-m3-divider"></div>
          <div class="solia-drawer-body solia-scroll-y">
            <!-- Sidebar Navigation Links -->
            ${this.renderDrawerLinks()}
          </div>
        </div>
      </div>
    `;
    uiContainer.insertAdjacentHTML('beforeend', modalDrawerHTML);

    // 4. Inject FAB into right-overlay (correct absolute parent)
    const fabHTML = `
      <div id="solia-fab-container">
        <button class="solia-m3-fab solia-interactive" onclick="SoliaUI.menu.openBookingDialog()">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
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

    // 5. Inject Contact/Booking Modal Dialog — into uiContainer (full-screen overlay)
    const bookingModalHTML = `
      <div id="solia-booking-modal" class="solia-interactive">
        <div class="solia-info-card solia-interactive" style="padding:24px; gap:16px; display:flex; flex-direction:column;">
          <h2 class="solia-info-title" style="font-size:20px; font-family:var(--font-family-serif); color: var(--md-sys-color-on-surface);">Đặt lịch tham quan dự án</h2>
          <p style="font-size:13px; color:var(--md-sys-color-on-surface-variant);">Để lại thông tin, nhân viên tư vấn của Solia sẽ liên hệ với quý khách trong vòng 15 phút.</p>
          <input type="text" placeholder="Họ và tên" id="book-name">
          <input type="tel" placeholder="Số điện thoại" id="book-phone">
          <div class="solia-info-actions" style="margin-top:8px;">
            <button class="solia-btn-secondary solia-interactive" onclick="SoliaUI.menu.closeBookingDialog()">Hủy</button>
            <button class="solia-btn-primary solia-interactive" onclick="SoliaUI.menu.submitBooking()">Đăng ký ngay</button>
          </div>
        </div>
      </div>
    `;
    uiContainer.insertAdjacentHTML('beforeend', bookingModalHTML);

    this.initEvents();
  }

  getPanelMarkup(platform) {
    return `
      <!-- Top Search / Menu Bar -->
      <div class="solia-m3-search-bar" ${platform === 'mobile' ? 'onclick="SoliaUI.menu.toggleSheet(true)"' : ''}>
        <button class="solia-m3-menu-btn solia-interactive" onclick="event.stopPropagation(); SoliaUI.menu.toggleDrawer(true)">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <input type="text" class="solia-m3-search-input solia-interactive search-input-${platform}" placeholder="Tìm kiếm điểm đến..." ${platform === 'mobile' ? 'onclick="event.stopPropagation()"' : ''}>
        
        <!-- Action Icon (Search icon for mobile, Collapse icon for desktop) -->
        ${platform === 'desktop' ? `
          <button class="solia-m3-menu-btn solia-interactive" style="margin-left:auto;" onclick="event.stopPropagation(); SoliaUI.menu.toggleLeftMenu(true)" title="Thu gọn danh mục">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
        ` : `
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" style="margin-left:auto;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        `}
      </div>

      <!-- Current Location Label (ALWAYS VISIBLE) -->
      <div class="solia-location-status" ${platform === 'mobile' ? 'onclick="SoliaUI.menu.toggleSheet()"' : ''}>
        <span class="solia-location-label">ĐANG XEM</span>
        <h2 class="solia-location-title title-display-${platform}">Đang tải...</h2>
      </div>

      <!-- Horizontal Assist Chips scrolling -->
      <div class="solia-chips-scroll solia-scroll-x">
        ${this.renderChips(platform)}
      </div>

      <div class="solia-m3-divider"></div>

      <!-- M3 list of items in active category -->
      <div class="solia-scroll-y">
        <div class="solia-m3-list list-container-${platform}">
          <!-- Dynamic Items Rendered Here -->
        </div>
      </div>
    `;
  }

  renderChips(platform) {
    return SoliaConfig.menuGroups.map(group => `
      <button class="solia-m3-chip solia-interactive chip-${platform}-${group.id} ${group.id === this.activeGroupId ? 'active' : ''}" 
              onclick="event.stopPropagation(); SoliaUI.menu.setCategory('${group.id}')">
        <span>${group.title}</span>
      </button>
    `).join('');
  }

  renderDrawerLinks() {
    return `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <button class="solia-m3-list-item solia-interactive" onclick="window.open('${SoliaConfig.googleMapUrl}', '_blank')" style="background:transparent;">
          <div class="solia-m3-item-icon-container"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
          <div class="solia-m3-item-content">
            <span class="solia-m3-item-title">Bản đồ Google Map</span>
            <span class="solia-m3-item-desc">Vị trí dự án trên Google vệ tinh</span>
          </div>
        </button>
        <button class="solia-m3-list-item solia-interactive" onclick="window.open('${SoliaConfig.websiteUrl}', '_blank')" style="background:transparent;">
          <div class="solia-m3-item-icon-container"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></div>
          <div class="solia-m3-item-content">
            <span class="solia-m3-item-title">Website Genera</span>
            <span class="solia-m3-item-desc">Xem chi tiết bảng giá và chính sách</span>
          </div>
        </button>
      </div>
    `;
  }

  initEvents() {
    // Dynamic search filtering
    const searchDesktop = document.querySelector(".search-input-desktop");
    const searchMobile = document.querySelector(".search-input-mobile");

    const handleSearch = (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      // Sync search input values
      if (searchDesktop) searchDesktop.value = this.searchQuery;
      if (searchMobile) searchMobile.value = this.searchQuery;
      this.filterItems();
    };

    if (searchDesktop) searchDesktop.addEventListener('input', handleSearch);
    if (searchMobile) searchMobile.addEventListener('input', handleSearch);

    // Initial item render
    this.updateLists();
  }

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

  setCategory(groupId) {
    this.activeGroupId = groupId;
    
    // Update chip active states in DOM
    const chips = document.querySelectorAll(".solia-m3-chip");
    chips.forEach(chip => {
      if (chip.classList.contains(`chip-desktop-${groupId}`) || chip.classList.contains(`chip-mobile-${groupId}`)) {
        chip.classList.add("active");
      } else {
        chip.classList.remove("active");
      }
    });

    this.updateLists();
  }

  updateLists() {
    const activeGroup = SoliaConfig.menuGroups.find(g => g.id === this.activeGroupId);
    if (!activeGroup) return;

    // Filter items based on search query
    const filteredItems = activeGroup.items.filter(item => 
      item.title.toLowerCase().includes(this.searchQuery)
    );

    const listHTML = filteredItems.map(item => {
      const isActive = item.name === this.currentScene;
      const baseUrl = SoliaConfig.panoBaseUrl ? SoliaConfig.panoBaseUrl.replace(/\/$/, '') : '';
      const thumb = `${baseUrl}/panos/${item.name.replace('scene_', '')}.tiles/thumb.jpg`;
      const desc = SoliaConfig.sceneDetails[item.name]?.description || "Không gian 360 độ.";

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
          <svg class="solia-m3-item-chevron" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      `;
    }).join('');

    const destList = document.querySelector(".list-container-desktop");
    const mobList = document.querySelector(".list-container-mobile");

    if (destList) destList.innerHTML = listHTML;
    if (mobList) mobList.innerHTML = listHTML;
  }

  filterItems() {
    this.updateLists();
  }

  selectScene(sceneName) {
    if (this.orch.krpano) {
      this.orch.krpano.call(`skin_loadscene(${sceneName}, get(skin_settings.loadscene_blend))`);
      // Close sheet on mobile after selecting
      if (window.innerWidth <= 768) {
        this.toggleSheet(false);
      }
    }
  }

  setActiveScene(sceneName) {
    this.currentScene = sceneName;
    
    // Update location displays
    const title = this.orch.krpano ? this.orch.krpano.get(`scene[${sceneName}].title`) : sceneName;
    const titleDesktop = document.querySelector(".title-display-desktop");
    const titleMobile = document.querySelector(".title-display-mobile");

    if (titleDesktop) titleDesktop.textContent = title;
    if (titleMobile) titleMobile.textContent = title;

    // Expand correct category if current scene belongs to another one
    let currentGroupId = null;
    SoliaConfig.menuGroups.forEach(g => {
      const match = g.items.some(item => item.name === sceneName);
      if (match) currentGroupId = g.id;
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
    if (this.drawerOpen) {
      el.classList.add("open");
    } else {
      el.classList.remove("open");
    }
  }

  toggleSheet(forceState) {
    this.sheetOpen = forceState !== undefined ? forceState : !this.sheetOpen;
    const el = document.getElementById("solia-bottom-sheet");
    if (this.sheetOpen) {
      el.classList.add("open");
    } else {
      el.classList.remove("open");
    }
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
    const name = document.getElementById("book-name").value;
    const phone = document.getElementById("book-phone").value;
    if (!name || !phone) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    alert(`Cảm ơn ${name}! Yêu cầu tư vấn của bạn đã được tiếp nhận. Tư vấn viên của Solia sẽ gọi điện cho bạn sớm nhất.`);
    this.closeBookingDialog();
    document.getElementById("book-name").value = "";
    document.getElementById("book-phone").value = "";
  }
}

window.SoliaMenu = SoliaMenu;
