/**
 * hotspot.js
 * Solia Virtual Tour — Orange Luxury Design System
 * Dynamic Hotspot custom behavior & styling support
 */

class SoliaHotspotManager {
  constructor(orchestrator) {
    this.orch = orchestrator;
  }

  // Utility to inject CSS properties directly into Krpano text-based hotspots at runtime
  getHotspotStyle() {
    return "font-family: 'Be Vietnam Pro', sans-serif; font-size: 13px; font-weight: 600; color: #FFFFFF; background: linear-gradient(135deg, #FF7A00 0%, #FF9E2C 100%); padding: 8px 16px; border-radius: 20px; box-shadow: 0 4px 16px rgba(255, 122, 0, 0.35); border: 1px solid rgba(255,255,255,0.25); text-align: center; transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);";
  }

  getHotspotHoverStyle() {
    return "font-family: 'Be Vietnam Pro', sans-serif; font-size: 13px; font-weight: 600; color: #FFFFFF; background: linear-gradient(135deg, #FF8B1A 0%, #FFB347 100%); padding: 8px 16px; border-radius: 20px; box-shadow: 0 6px 24px rgba(255, 122, 0, 0.5); border: 1px solid rgba(255,255,255,0.4); text-align: center; transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);";
  }
}

window.SoliaHotspots = new SoliaHotspotManager(window.SoliaUI);
