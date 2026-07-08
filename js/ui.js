/**
 * ui.js
 * Solia Virtual Tour — Orange/Gold Luxury Design System
 * Main Orchestrator & HTML Overlay Injection
 */

class SoliaUIOrchestrator {
  constructor() {
    this.krpano = null;
    this.currentScene = "";
    this.initialized = false;
    this.domReady = false;
    this.pendingKrpanoInstance = null;

    // Direct check of document.body presence to bypass readyState parsing inconsistencies
    if (document.body) {
      this.onDOMReady();
    } else {
      document.addEventListener("DOMContentLoaded", () => this.onDOMReady());
    }
  }

  onDOMReady() {
    if (this.domReady) return;
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
    if (!document.body) return; // Defensive check
    
    // We want a minimum 10 seconds for the cinematic intro
    this.minLoaderTime = 10000;
    this.loaderStartTime = Date.now();
    this.loaderComplete = false;

    // Cinematic texts that rotate
    this.poeticPhrases = [
      "Khởi tạo không gian sống thượng lưu...",
      "Tái hiện kiệt tác kiến trúc...",
      "Hoàn thiện trải nghiệm đẳng cấp...",
      "Chuẩn bị bước vào đặc quyền sống tinh hoa..."
    ];
    this.currentPhraseIndex = 0;

    // Generic background images (thumbnails of scenes)
    this.bgImages = [
      "panos/livingroom.tiles/thumb.jpg",
      "panos/masterbedroom.tiles/thumb.jpg",
      "panos/pool.tiles/thumb.jpg"
    ];
    this.currentBgIndex = 0;
    
    const loadingHTML = `
      <div id="solia-cinematic-loader">
        <div class="solia-loader-bg-container" id="solia-loader-bg-container">
          <!-- BGs will be injected here -->
        </div>
        
        <div class="solia-loader-content">
          <img src="${SoliaConfig.logoUrl}" class="solia-loader-logo" alt="Genera Logo" onerror="this.style.display='none'">
          <h1 class="solia-loader-brand">${SoliaConfig.tourTitle}</h1>
          <div class="solia-loader-poetic-text" id="solia-loader-text">Đang kết nối không gian...</div>
          
          <div class="solia-loader-progress-container">
            <div class="solia-loader-progress-bar" id="solia-progress-bar"></div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHTML);

    this.initCinematicEffects();

    // Progress bar simulation (reaches 100% in exactly 10s)
    let progress = 0;
    const progressInterval = 100; // run every 100ms
    const step = 100 / (this.minLoaderTime / progressInterval); 
    
    this.progressInterval = setInterval(() => {
      if (progress < 99) {
        progress += step;
        this.updateProgress(progress);
      }
    }, progressInterval);
  }

  initCinematicEffects() {
    // Inject BGs
    const bgContainer = document.getElementById("solia-loader-bg-container");
    if (!bgContainer) return;
    
    let bgHTML = '';
    this.bgImages.forEach((img, index) => {
      // Use standard skin fallback if thumb not found
      bgHTML += `<div class="solia-loader-bg-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${img}');" id="loader-bg-${index}"></div>`;
    });
    bgContainer.innerHTML = bgHTML;

    // Slide rotation
    this.bgInterval = setInterval(() => {
      const currentBg = document.getElementById(`loader-bg-${this.currentBgIndex}`);
      if (currentBg) currentBg.classList.remove("active");
      
      this.currentBgIndex = (this.currentBgIndex + 1) % this.bgImages.length;
      
      const nextBg = document.getElementById(`loader-bg-${this.currentBgIndex}`);
      if (nextBg) nextBg.classList.add("active");
    }, 4000);

    // Text rotation
    const textEl = document.getElementById("solia-loader-text");
    this.textInterval = setInterval(() => {
      if (!textEl) return;
      textEl.style.opacity = 0;
      setTimeout(() => {
        this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.poeticPhrases.length;
        textEl.textContent = this.poeticPhrases[this.currentPhraseIndex];
        textEl.style.opacity = 1;
      }, 800); // Wait for fade out
    }, 3500);
  }

  updateProgress(percent) {
    const barEl = document.getElementById("solia-progress-bar");
    if (barEl) {
      barEl.style.width = `${Math.min(percent, 100)}%`;
    }
  }

  hideLoading() {
    this.loaderComplete = true; // Krpano is ready
    
    const timeElapsed = Date.now() - this.loaderStartTime;
    const remainingTime = Math.max(0, this.minLoaderTime - timeElapsed);

    // Wait until minimum time has elapsed
    setTimeout(() => {
      clearInterval(this.progressInterval);
      clearInterval(this.bgInterval);
      clearInterval(this.textInterval);
      
      this.updateProgress(100);
      
      setTimeout(() => {
        const loader = document.getElementById("solia-cinematic-loader");
        if (loader) {
          loader.classList.add("fade-out");
          setTimeout(() => loader.remove(), 1200); // Match CSS transition time
        }
      }, 500);
    }, remainingTime);
  }

  initializeUI() {
    if (this.initialized) return;
    this.initialized = true;

    // Inject base container overlay with both grid slots
    const containerHTML = `
      <div id="solia-ui">
        <div id="solia-right-overlay" class="solia-interactive"></div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', containerHTML);
    this.uiContainer = document.getElementById("solia-ui");
    this.rightOverlay = document.getElementById("solia-right-overlay");

    // Initialize all components
    this.menu = new SoliaMenu(this);
    this.toolbar = new SoliaToolbar(this);
    this.initInfoModal();
    this.initRippleEffect();

    // Initialize hotspot manager now that SoliaUI is ready
    if (window.SoliaHotspotManager) {
      window.SoliaHotspots = new window.SoliaHotspotManager(this);
    }

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
        <div class="solia-info-card">
          <img src="" class="solia-info-img" alt="Scene image">
          <div class="solia-info-body">
            <h2 class="solia-info-title">Tiêu đề địa điểm</h2>
            <p class="solia-info-text">Mô tả chi tiết về địa điểm này sẽ hiện ở đây.</p>
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
    
    let imageSrc = data.image;
    if (imageSrc && imageSrc.startsWith('/panos/') && SoliaConfig.panoBaseUrl) {
      const baseUrl = SoliaConfig.panoBaseUrl.replace(/\/$/, '');
      imageSrc = `${baseUrl}${imageSrc}`;
    }
    imgEl.src = imageSrc;

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
