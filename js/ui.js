/**
 * ui.js
 * Solia Virtual Tour — Orange Luxury Design System
 * Main Orchestrator & HTML Overlay Injection
 */

class SoliaUIOrchestrator {
  constructor() {
    this.krpano = null;
    this.currentScene = "";
    this.initialized = false;
    this.domReady = false;
    this.pendingKrpanoInstance = null;

    // Ensure DOM is ready before trying to inject the Loading Screen
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
  }

  onDOMReady() {
    this.domReady = true;
    this.initLoadingScreen();
    
    // If Krpano finished loading before DOMContentLoaded, initialize UI now
    if (this.pendingKrpanoInstance) {
      this.setKrpano(this.pendingKrpanoInstance);
    }
  }

  setKrpano(krpanoInstance) {
    if (!this.domReady) {
      this.pendingKrpanoInstance = krpanoInstance;
      return;
    }
    this.krpano = krpanoInstance;
    this.initializeUI();
  }

  // Create loading screen markup
  initLoadingScreen() {
    const loadingHTML = `
      <div id="solia-loading-screen">
        <div class="solia-loader-logo-container">
          <img src="${SoliaConfig.logoUrl}" class="solia-loader-logo animate-pulse-glow" alt="Solia Logo" onerror="this.style.display='none'">
          <h1 class="solia-loader-title">${SoliaConfig.tourTitle}</h1>
          <p class="solia-loader-subtitle">Luxury Property Tour</p>
        </div>
        <div class="solia-loader-progress-box">
          <svg class="solia-loader-progress-circle animate-spin-slow" width="120" height="120">
            <circle class="solia-loader-progress-bg" cx="60" cy="60" r="50"></circle>
            <circle class="solia-loader-progress-bar" cx="60" cy="60" r="50" stroke-dasharray="314.16" stroke-dashoffset="314.16"></circle>
          </svg>
          <div class="solia-loader-progress-text" id="solia-progress-text">0%</div>
        </div>
        <div class="solia-loader-desc">Đang tải không gian 360° cao cấp...</div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHTML);

    // Simulate progress load before Krpano XML is fully complete to offer instant microfeedback
    let progress = 0;
    this.progressInterval = setInterval(() => {
      if (progress < 85) {
        progress += Math.floor(Math.random() * 5) + 1;
        this.updateProgress(progress);
      }
    }, 120);
  }

  updateProgress(percent) {
    const textEl = document.getElementById("solia-progress-text");
    const barEl = document.querySelector(".solia-loader-progress-bar");
    if (textEl) textEl.textContent = `${percent}%`;
    if (barEl) {
      const offset = 314.16 - (314.16 * percent) / 100;
      barEl.style.strokeDashoffset = offset;
    }
  }

  hideLoading() {
    clearInterval(this.progressInterval);
    this.updateProgress(100);
    setTimeout(() => {
      const loader = document.getElementById("solia-loading-screen");
      if (loader) {
        loader.classList.add("fade-out");
        setTimeout(() => loader.remove(), 800);
      }
    }, 400);
  }

  initializeUI() {
    if (this.initialized) return;
    this.initialized = true;

    // Inject base container overlay
    const containerHTML = `<div id="solia-ui"></div>`;
    document.body.insertAdjacentHTML('beforeend', containerHTML);
    this.uiContainer = document.getElementById("solia-ui");

    // Initialize all components
    this.menu = new SoliaMenu(this);
    this.toolbar = new SoliaToolbar(this);
    this.initInfoModal();
    this.initRippleEffect();

    // Trigger initial highlights
    const initialScene = this.krpano.get("xml.scene");
    if (initialScene) {
      this.onSceneChange(initialScene);
    }
    
    // Hide initial loading screen
    this.hideLoading();
  }

  // Info card modal popup
  initInfoModal() {
    const modalHTML = `
      <div id="solia-info-modal" class="solia-interactive">
        <div class="solia-info-card solia-glass">
          <img src="" class="solia-info-img animate-shimmer" alt="Scene image">
          <div class="solia-info-body">
            <h2 class="solia-info-title solia-title">Tiêu đề địa điểm</h2>
            <p class="solia-info-text solia-subtitle">Mô tả chi tiết về địa điểm này sẽ hiện ở đây.</p>
            <div class="solia-info-actions">
              <button class="solia-btn-secondary solia-interactive" onclick="SoliaUI.closeInfoModal()">Đóng</button>
              <button class="solia-btn-primary solia-interactive" id="solia-info-cta">Đến khu vực này</button>
            </div>
          </div>
        </div>
      </div>
    `;
    this.uiContainer.insertAdjacentHTML('beforeend', modalHTML);
    this.modalEl = document.getElementById("solia-info-modal");

    // Click outside to close
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.closeInfoModal();
      }
    });
  }

  showInfoModal(sceneName) {
    const data = SoliaConfig.sceneDetails[sceneName] || {
      title: this.krpano.get(`scene[${sceneName}].title`) || "Dự án Genera",
      description: "Không gian trải nghiệm thực tế ảo 3D sang trọng được tạo bởi Solia.",
      image: this.krpano.get(`scene[${sceneName}].thumburl`) || "skin/vtourskin.png"
    };

    const titleEl = this.modalEl.querySelector(".solia-info-title");
    const descEl = this.modalEl.querySelector(".solia-info-text");
    const imgEl = this.modalEl.querySelector(".solia-info-img");
    const ctaEl = document.getElementById("solia-info-cta");

    titleEl.textContent = data.title;
    descEl.textContent = data.description;
    imgEl.src = data.image;

    ctaEl.onclick = () => {
      this.closeInfoModal();
      this.krpano.call(`skin_loadscene(${sceneName}, get(skin_settings.loadscene_blend))`);
    };

    this.modalEl.classList.add("open");
  }

  closeInfoModal() {
    this.modalEl.classList.remove("open");
  }

  // Micro-interaction: ripple effect for clicks on interactive elements
  initRippleEffect() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.solia-interactive');
      if (!button) return;

      button.classList.add('solia-ripple-container');
      const ripple = document.createElement('span');
      ripple.classList.add('solia-ripple-effect');

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;

      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      button.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }

  // Receive scene change updates from Krpano onxmlcomplete/onnewpano
  onSceneChange(sceneName) {
    this.currentScene = sceneName;
    
    // Highlight menu active
    if (this.menu) {
      this.menu.setActiveScene(sceneName);
    }

    // Highlight floorplan thumbnail active if initialized
    if (this.toolbar && this.toolbar.floorplan) {
      this.toolbar.floorplan.setActiveScene(sceneName);
    }
  }
}

// Global hook for script orchestration
window.SoliaUI = new SoliaUIOrchestrator();
