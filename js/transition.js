/**
 * transition.js
 * Solia Virtual Tour — Orange Luxury Design System
 * Scene transition configurations
 */

const SoliaTransitions = {
  // Pre-configured transitions matching Krpano blends
  default: "BLEND(0.8, easeInOutCubic)",
  fade: "FADEBLEND(1.0, 0x000000, easeInOutQuart)",
  zoom: "ZOOMBLEND(1.2, 2.0, easeInOutExpo)",
  parallax: "SLIDEBLEND(0.8, 0, 0.2, easeInOutCubic)",
  
  apply(krpano, sceneName, type = 'default') {
    if (!krpano) return;
    const blendStr = this[type] || this.default;
    krpano.call(`loadscene(${sceneName}, null, MERGE, ${blendStr})`);
  }
};

window.SoliaTransitions = SoliaTransitions;
