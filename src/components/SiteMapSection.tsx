import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import {
  MapPin,
  Flame,
  Layers,
  Activity,
  Compass,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Info,
} from 'lucide-react';
import { playHoverTick, playSonarPing } from '../utils/audio';

// Attribution override per google-maps-platform-ghp-integration skill
const INTERNAL_USAGE_ATTRIBUTION_IDS = ['gmp_mcp_codeassist_v1_aistudio'];

export interface MonitoringSite {
  id: string;
  code: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  risk: 'SEVERE' | 'SIGNIFICANT' | 'WATCH' | 'NORMAL';
  sst: number; // Sea Surface Temp °C
  dhw: number; // Degree Heating Weeks
  trend: string;
  depth: number;
  salinity: number; // PSU
  ph: number;
  coralCover: string;
  statusText: string;
  sparkline: number[];
  recommendation: string;
}

const SITES_DATA: MonitoringSite[] = [
  {
    id: 'gom-01',
    code: 'GOM-01',
    name: 'Gulf of Mannar Reef',
    region: 'Marine National Park / Core Sanctuary',
    lat: 9.20,
    lng: 79.15,
    risk: 'SEVERE',
    sst: 30.4,
    dhw: 9.2,
    trend: '+0.42°C / 7d',
    depth: 14,
    salinity: 34.8,
    ph: 7.92,
    coralCover: '42% (bleaching active)',
    statusText: 'Severe thermal accumulation exceeding mortality threshold. Urgent shading intervention recommended.',
    sparkline: [28.8, 29.1, 29.5, 29.9, 30.1, 30.4],
    recommendation: 'Deploy autonomous micro-bubble aeration & surface reflective film in sector B3.',
  },
  {
    id: 'gom-02',
    code: 'GOM-02',
    name: 'Tuticorin Coast',
    region: 'South Gulf Archipelago',
    lat: 8.80,
    lng: 78.20,
    risk: 'WATCH',
    sst: 29.6,
    dhw: 3.1,
    trend: '+0.11°C / 7d',
    depth: 22,
    salinity: 35.1,
    ph: 8.05,
    coralCover: '61% (resilient)',
    statusText: 'Moderate upwelling dampening SST surge. Continued monitoring of current shift advised.',
    sparkline: [29.2, 29.3, 29.4, 29.4, 29.5, 29.6],
    recommendation: 'Maintain continuous acoustic telemetry; calibrate thermocline depth sensors.',
  },
  {
    id: 'pb-01',
    code: 'PB-01',
    name: 'Palk Bay Seaweed Farm',
    region: 'Shallow Coastal Lagoon',
    lat: 9.45,
    lng: 79.10,
    risk: 'SIGNIFICANT',
    sst: 30.0,
    dhw: 5.4,
    trend: '+0.25°C / 7d',
    depth: 8,
    salinity: 33.9,
    ph: 8.12,
    coralCover: 'Macroalgae Canopy 84 g/m²',
    statusText: 'Elevated surface retention in shallow waters. Epiphyte overgrowth hazard flagged.',
    sparkline: [29.1, 29.3, 29.6, 29.8, 29.9, 30.0],
    recommendation: 'Harvest quadrant 4 early; rotate suspension lines to lower depths (4-6m).',
  },
  {
    id: 'pb-02',
    code: 'PB-02',
    name: 'Mandapam Coast',
    region: 'Strait Passage Channel',
    lat: 9.28,
    lng: 79.15,
    risk: 'NORMAL',
    sst: 28.9,
    dhw: 0.8,
    trend: '-0.05°C / 7d',
    depth: 18,
    salinity: 35.0,
    ph: 8.16,
    coralCover: '74% (optimal health)',
    statusText: 'Strong tidal flushing maintains thermal stability within historical envelope.',
    sparkline: [29.2, 29.1, 29.0, 29.0, 28.9, 28.9],
    recommendation: 'Baseline reference station. Sync real-time ground truth with BRCV ODE models.',
  },
];

const RISK_CONFIG = {
  SEVERE: {
    color: '#FF5A5F',
    bg: 'rgba(255, 90, 95, 0.15)',
    border: 'rgba(255, 90, 95, 0.4)',
    badge: 'SEVERE',
    glow: 'rgba(255, 90, 95, 0.5)',
  },
  SIGNIFICANT: {
    color: '#F5B83F',
    bg: 'rgba(245, 184, 63, 0.15)',
    border: 'rgba(245, 184, 63, 0.4)',
    badge: 'SIGNIFICANT',
    glow: 'rgba(245, 184, 63, 0.5)',
  },
  WATCH: {
    color: '#F5B83F',
    bg: 'rgba(245, 184, 63, 0.15)',
    border: 'rgba(245, 184, 63, 0.4)',
    badge: 'WATCH',
    glow: 'rgba(245, 184, 63, 0.4)',
  },
  NORMAL: {
    color: '#4ADE80',
    bg: 'rgba(74, 222, 128, 0.15)',
    border: 'rgba(74, 222, 128, 0.4)',
    badge: 'NORMAL',
    glow: 'rgba(74, 222, 128, 0.4)',
  },
};

// Custom dark map styling matching Scientific Spatial UI
const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#07121F' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#02060D' }, { weight: 3 }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7A8CA3' }] },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: 'rgba(63, 245, 230, 0.25)' }, { weight: 1 }],
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [{ color: 'rgba(63, 245, 230, 0.15)' }, { weight: 0.75 }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3FF5E6' }],
  },
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#091A2E' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#061320' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#4A627D' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#0e243b' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#02060D' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3FF5E6' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#02060D' }],
  },
];

// Inner controller component to pan and zoom smoothly
const MapController: React.FC<{
  selectedSite: MonitoringSite | null;
  resetTrigger: number;
}> = ({ selectedSite, resetTrigger }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (selectedSite) {
      map.panTo({ lat: selectedSite.lat, lng: selectedSite.lng });
      map.setZoom(10);
    }
  }, [selectedSite, map]);

  useEffect(() => {
    if (!map || resetTrigger === 0) return;
    map.panTo({ lat: 9.12, lng: 79.13 });
    map.setZoom(8);
  }, [resetTrigger, map]);

  return null;
};

interface SiteMapSectionProps {
  soundEnabled?: boolean;
}

export const SiteMapSection: React.FC<SiteMapSectionProps> = ({ soundEnabled = false }) => {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
  const [selectedSite, setSelectedSite] = useState<MonitoringSite>(SITES_DATA[0]);
  const [hoveredSite, setHoveredSite] = useState<MonitoringSite | null>(null);
  const [heatOverlay, setHeatOverlay] = useState<boolean>(true);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resetCount, setResetCount] = useState<number>(0);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelectSite = (site: MonitoringSite) => {
    playSonarPing(soundEnabled);
    setSelectedSite(site);
  };

  const handleRunAnalysis = (site: MonitoringSite) => {
    playSonarPing(soundEnabled);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(`TideMind Autonomous Verification dispatched for ${site.code} (${site.name})`);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleResetView = () => {
    playHoverTick(soundEnabled);
    setResetCount((prev) => prev + 1);
  };

  return (
    <section
      id="sites"
      className="relative w-full py-20 px-4 sm:px-6 lg:px-8 border-t border-[rgba(63,245,230,0.15)] bg-gradient-to-b from-[#02060D] via-[#040C18] to-[#02060D] overflow-hidden"
    >
      {/* Background ambient radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(ellipse at center, #3FF5E6 0%, #07121F 60%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#3FF5E6] animate-pulse" />
              <span className="font-mono text-xs text-[#3FF5E6] uppercase tracking-widest">
                // 03B · GEOSPATIAL SENSOR GRID · LIVE SITES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-space font-bold tracking-tight text-[#E6F1FF]">
              Real-Time Marine Sensor Observation Grid
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#7A8CA3] max-w-2xl font-inter">
              Ground-truth telemetric moorings, acoustic buoys, and benthic stations across the
              Gulf of Mannar and Palk Bay coral ecosystems. Every point fed into BRCV counterfactual verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-mono px-2 py-1 bg-[#07121F] border border-[rgba(63,245,230,0.2)] text-[#7A8CA3] uppercase tracking-wider">
              ILLUSTRATIVE DEMO DATA
            </span>
            <button
              onClick={handleResetView}
              onMouseEnter={() => playHoverTick(soundEnabled)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#07121F]/80 hover:bg-[#0B1E33] border border-[rgba(63,245,230,0.25)] text-[#3FF5E6] text-xs font-mono transition-colors"
              title="Reset Map to Regional Extent"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RESET EXTENT</span>
            </button>
            <button
              onClick={() => {
                playHoverTick(soundEnabled);
                setHeatOverlay((prev) => !prev);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono transition-colors ${
                heatOverlay
                  ? 'bg-[#3FF5E6]/15 border-[#3FF5E6] text-[#3FF5E6]'
                  : 'bg-[#07121F]/80 border-[rgba(63,245,230,0.2)] text-[#7A8CA3]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>HEAT OVERLAY: {heatOverlay ? 'ON' : 'OFF'}</span>
            </button>
            <button
              onClick={() => {
                playHoverTick(soundEnabled);
                setMapType((prev) => (prev === 'roadmap' ? 'hybrid' : 'roadmap'));
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#07121F]/80 hover:bg-[#0B1E33] border border-[rgba(63,245,230,0.2)] text-[#E6F1FF] text-xs font-mono transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{mapType === 'roadmap' ? 'HYBRID SATELLITE' : 'DARK VECTOR'}</span>
            </button>
          </div>
        </div>

        {/* Site Quick-Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {SITES_DATA.map((site) => {
            const isSelected = selectedSite.id === site.id;
            const riskMeta = RISK_CONFIG[site.risk];
            return (
              <button
                key={site.id}
                onClick={() => handleSelectSite(site)}
                onMouseEnter={() => {
                  playHoverTick(soundEnabled);
                  setHoveredSite(site);
                }}
                onMouseLeave={() => setHoveredSite(null)}
                className={`text-left p-2.5 transition-all border relative ${
                  isSelected
                    ? 'bg-[#07121F] border-[#3FF5E6] shadow-[0_0_15px_rgba(63,245,230,0.15)]'
                    : 'bg-[#07121F]/50 hover:bg-[#07121F]/80 border-[rgba(63,245,230,0.15)]'
                }`}
              >
                {/* Active cyan corner indicator */}
                {isSelected && (
                  <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#3FF5E6]" />
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-[#E6F1FF]">{site.code}</span>
                  <span
                    className="font-mono text-[9px] px-1.5 py-0.5 rounded-xs font-semibold"
                    style={{
                      color: riskMeta.color,
                      backgroundColor: riskMeta.bg,
                      border: `1px solid ${riskMeta.border}`,
                    }}
                  >
                    {riskMeta.badge}
                  </span>
                </div>
                <div className="text-xs text-[#7A8CA3] truncate">{site.name}</div>
                <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#3FF5E6]">{site.sst.toFixed(1)}°C</span>
                  <span className="text-[#7A8CA3]">{site.dhw.toFixed(1)} DHW</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Map (2/3) + Site Telemetry Inspector (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Frame (8 cols on lg) */}
          <div className="lg:col-span-8 relative border border-[rgba(63,245,230,0.25)] bg-[#07121F] rounded-none overflow-hidden shadow-[0_8px_32px_rgba(2,6,13,0.8)]">
            {/* Top Frame Bar */}
            <div className="h-9 bg-[#040C18] border-b border-[rgba(63,245,230,0.18)] px-4 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                <span className="text-[#3FF5E6] font-bold">GOOGLE MAPS PLATFORM · JS API</span>
                <span className="text-[#7A8CA3] text-[10px] hidden sm:inline">| GULF OF MANNAR SECTOR</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#7A8CA3]">
                <span>LAT: 9.12°N</span>
                <span>LON: 79.13°E</span>
              </div>
            </div>

            {/* Map Container (fixed height per CF2) */}
            <div className="relative w-full h-[460px] sm:h-[540px] bg-[#02060D]">
              {apiKey ? (
                <APIProvider apiKey={apiKey} libraries={['marker']}>
                  <Map
                    mapId="DEMO_MAP_ID"
                    defaultCenter={{ lat: 9.12, lng: 79.13 }}
                    defaultZoom={8}
                    gestureHandling="greedy"
                    disableDefaultUI={true}
                    zoomControl={true}
                    mapTypeId={mapType}
                    styles={mapType === 'roadmap' ? DARK_MAP_STYLES : undefined}
                    internalUsageAttributionIds={INTERNAL_USAGE_ATTRIBUTION_IDS}
                    className="w-full h-full"
                  >
                    <MapController selectedSite={selectedSite} resetTrigger={resetCount} />

                    {/* Advanced Markers for each marine station */}
                    {SITES_DATA.map((site) => {
                      const isSelected = selectedSite.id === site.id;
                      const riskMeta = RISK_CONFIG[site.risk];

                      return (
                        <AdvancedMarker
                          key={site.id}
                          position={{ lat: site.lat, lng: site.lng }}
                          title={`${site.code} - ${site.name}`}
                          onClick={() => handleSelectSite(site)}
                        >
                          <div
                            className="group relative cursor-pointer select-none"
                            onMouseEnter={() => {
                              playHoverTick(soundEnabled);
                              setHoveredSite(site);
                            }}
                            onMouseLeave={() => setHoveredSite(null)}
                          >
                            {/* Pulsing Thermal Stress Aura (if Heat Overlay active) */}
                            {heatOverlay && (
                              <div
                                className="absolute -inset-5 rounded-full pointer-events-none animate-ping opacity-35"
                                style={{
                                  backgroundColor: riskMeta.color,
                                  animationDuration: site.risk === 'SEVERE' ? '1.4s' : '3s',
                                }}
                              />
                            )}

                            {/* Outer Glow Halo */}
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-125"
                              style={{
                                backgroundColor: isSelected ? 'rgba(7, 18, 31, 0.95)' : 'rgba(7, 18, 31, 0.85)',
                                border: `2px solid ${isSelected ? '#3FF5E6' : riskMeta.color}`,
                                boxShadow: `0 0 16px ${riskMeta.glow}`,
                              }}
                            >
                              {/* Inner Pulse Ring */}
                              <div
                                className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: riskMeta.color }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                              </div>
                            </div>

                            {/* Station Badge Label */}
                            <div
                              className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-tight rounded-xs border shadow-md pointer-events-none transition-opacity duration-200"
                              style={{
                                backgroundColor: '#07121F',
                                borderColor: isSelected ? '#3FF5E6' : 'rgba(63,245,230,0.3)',
                                color: isSelected ? '#3FF5E6' : '#E6F1FF',
                              }}
                            >
                              {site.code}
                            </div>
                          </div>
                        </AdvancedMarker>
                      );
                    })}
                  </Map>
                </APIProvider>
              ) : (
                /* Fallback if API key missing */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#07121F]">
                  <Compass className="w-12 h-12 text-[#3FF5E6] animate-spin mb-3 opacity-60" />
                  <p className="font-mono text-sm text-[#E6F1FF] font-bold">
                    Initializing Google Maps Platform Vector Engine...
                  </p>
                  <p className="text-xs text-[#7A8CA3] mt-1 max-w-md">
                    Provisioned API key detected. Establishing encrypted session with Google Maps JavaScript API.
                  </p>
                </div>
              )}

              {/* Floating Map Legend (Bottom Left) */}
              <div className="absolute bottom-3 left-3 z-10 bg-[#07121F]/90 backdrop-blur-md border border-[rgba(63,245,230,0.2)] p-2.5 font-mono text-[10px] pointer-events-auto">
                <div className="text-[#3FF5E6] font-bold mb-1.5 tracking-wider uppercase flex items-center gap-1.5">
                  <Activity className="w-3 h-3" />
                  <span>DHW THERMAL RISK KEY</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A5F]" />
                    <span className="text-[#E6F1FF]">DHW &gt; 8.0 · Severe Mortality Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F5B83F]" />
                    <span className="text-[#E6F1FF]">DHW 4.0–8.0 · Significant Bleaching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]" />
                    <span className="text-[#E6F1FF]">DHW &lt; 4.0 · Safe Physiological Envelope</span>
                  </div>
                </div>
              </div>

              {/* Hover Tooltip (if hovering over a marker) */}
              {hoveredSite && hoveredSite.id !== selectedSite.id && (
                <div className="absolute top-3 left-3 z-20 bg-[#07121F]/95 border border-[#3FF5E6] p-2 font-mono text-xs shadow-xl pointer-events-none animate-fadeIn">
                  <div className="font-bold text-[#3FF5E6]">{hoveredSite.code} · {hoveredSite.name}</div>
                  <div className="text-[11px] text-[#7A8CA3] mt-0.5">
                    SST: <span className="text-white">{hoveredSite.sst}°C</span> | DHW: <span className="text-white">{hoveredSite.dhw}</span>
                  </div>
                  <div className="text-[10px] text-[#3FF5E6] mt-1">Click station pin to inspect full telemetry →</div>
                </div>
              )}
            </div>

            {/* Bottom Status Ticker */}
            <div className="bg-[#040C18] border-t border-[rgba(63,245,230,0.18)] p-2.5 font-mono text-[11px] text-[#7A8CA3] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[#3FF5E6]">DATA SOURCE:</span>
                <span>NOAA Coral Reef Watch (CRW) 5km v3.1 + TideMind Acoustic Buoy Array</span>
              </div>
              <div className="text-[10px] text-[#3FF5E6]/80">
                PROJECTION: EPSG:3857 · LATENCY: 24ms
              </div>
            </div>
          </div>

          {/* Site Telemetry Inspector Panel (4 cols on lg) */}
          <div className="lg:col-span-4 bg-[#07121F]/90 border border-[rgba(63,245,230,0.3)] relative p-5 shadow-[0_8px_30px_rgba(2,6,13,0.8)]">
            {/* Cyan Corner Brackets */}
            <span className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-[#3FF5E6]" />
            <span className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2 border-[#3FF5E6]" />
            <span className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-[#3FF5E6]" />
            <span className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-[#3FF5E6]" />

            <div className="flex items-center justify-between mb-3 border-b border-[rgba(63,245,230,0.18)] pb-2.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#3FF5E6]" />
                <span className="font-mono text-xs font-bold text-[#3FF5E6] uppercase tracking-wider">
                  STATION TELEMETRY
                </span>
              </div>
              <span
                className="font-mono text-[10px] px-2 py-0.5 font-bold uppercase rounded-xs"
                style={{
                  color: RISK_CONFIG[selectedSite.risk].color,
                  backgroundColor: RISK_CONFIG[selectedSite.risk].bg,
                  border: `1px solid ${RISK_CONFIG[selectedSite.risk].border}`,
                }}
              >
                {selectedSite.risk} RISK
              </span>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-space font-bold text-[#E6F1FF]">{selectedSite.name}</h3>
                <span className="font-mono text-xs text-[#3FF5E6] font-semibold">{selectedSite.code}</span>
              </div>
              <div className="text-xs text-[#7A8CA3] font-inter mt-0.5">{selectedSite.region}</div>
            </div>

            {/* Metrics 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2.5 my-4">
              <div className="bg-[#02060D]/60 border border-[rgba(63,245,230,0.15)] p-2.5">
                <div className="text-[10px] font-mono text-[#7A8CA3] uppercase">SEA SURFACE TEMP</div>
                <div className="text-xl font-mono font-bold text-[#3FF5E6] mt-0.5">
                  {selectedSite.sst.toFixed(1)}°C
                </div>
                <div className="text-[10px] font-mono text-amber-400 mt-0.5">{selectedSite.trend}</div>
              </div>

              <div className="bg-[#02060D]/60 border border-[rgba(63,245,230,0.15)] p-2.5">
                <div className="text-[10px] font-mono text-[#7A8CA3] uppercase">DEGREE HEATING WEEKS</div>
                <div
                  className="text-xl font-mono font-bold mt-0.5"
                  style={{ color: RISK_CONFIG[selectedSite.risk].color }}
                >
                  {selectedSite.dhw.toFixed(1)}
                </div>
                <div className="text-[10px] font-mono text-[#7A8CA3] mt-0.5">Threshold: 8.0 DHW</div>
              </div>

              <div className="bg-[#02060D]/60 border border-[rgba(63,245,230,0.15)] p-2.5">
                <div className="text-[10px] font-mono text-[#7A8CA3] uppercase">STATION DEPTH</div>
                <div className="text-base font-mono font-bold text-[#E6F1FF] mt-0.5">
                  {selectedSite.depth} meters
                </div>
                <div className="text-[10px] font-mono text-[#7A8CA3] mt-0.5">Benthic Shelf</div>
              </div>

              <div className="bg-[#02060D]/60 border border-[rgba(63,245,230,0.15)] p-2.5">
                <div className="text-[10px] font-mono text-[#7A8CA3] uppercase">SALINITY / pH</div>
                <div className="text-base font-mono font-bold text-[#E6F1FF] mt-0.5">
                  {selectedSite.salinity} PSU
                </div>
                <div className="text-[10px] font-mono text-[#3FF5E6] mt-0.5">pH {selectedSite.ph}</div>
              </div>
            </div>

            {/* 6-Week SST Sparkline Trend */}
            <div className="bg-[#02060D]/70 border border-[rgba(63,245,230,0.18)] p-3 mb-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#7A8CA3] mb-1.5">
                <span>6-WEEK SST TRAJECTORY</span>
                <span className="text-[#3FF5E6]">PEAK: {Math.max(...selectedSite.sparkline).toFixed(1)}°C</span>
              </div>
              <div className="h-10 flex items-end gap-1.5 pt-1">
                {selectedSite.sparkline.map((val, idx) => {
                  const min = 28.0;
                  const max = 31.0;
                  const pct = Math.max(15, Math.min(100, ((val - min) / (max - min)) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group/bar">
                      <div
                        className="w-full transition-all duration-300 relative rounded-t-xs"
                        style={{
                          height: `${pct}%`,
                          backgroundColor:
                            val >= 30.2 ? '#FF5A5F' : val >= 29.8 ? '#F5B83F' : '#3FF5E6',
                        }}
                      >
                        <span className="opacity-0 group-hover/bar:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-[#E6F1FF] bg-[#02060D] px-1 border border-[rgba(63,245,230,0.3)] pointer-events-none z-10">
                          {val}°C
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[9px] font-mono text-[#7A8CA3] mt-1.5">
                <span>W-5</span>
                <span>W-4</span>
                <span>W-3</span>
                <span>W-2</span>
                <span>W-1</span>
                <span className="text-[#3FF5E6]">NOW</span>
              </div>
            </div>

            {/* Coral Cover & Ecosystem Diagnostics */}
            <div className="space-y-2 text-xs font-inter mb-4">
              <div className="bg-[#02060D]/50 border border-[rgba(63,245,230,0.1)] p-2.5">
                <span className="text-[10px] font-mono text-[#7A8CA3] uppercase block mb-0.5">
                  BENTHIC OBSERVATION
                </span>
                <p className="text-[#E6F1FF] text-xs font-mono">{selectedSite.coralCover}</p>
                <p className="text-[#7A8CA3] text-[11px] mt-1 leading-relaxed">{selectedSite.statusText}</p>
              </div>

              <div className="bg-[#02060D]/50 border border-[rgba(63,245,230,0.1)] p-2.5">
                <span className="text-[10px] font-mono text-[#3FF5E6] uppercase block mb-0.5">
                  AI RECOMMENDATION (CREW PROTOCOL)
                </span>
                <p className="text-xs text-[#E6F1FF] leading-relaxed">{selectedSite.recommendation}</p>
              </div>
            </div>

            {/* Run TideMind Analysis Action Button */}
            <button
              onClick={() => handleRunAnalysis(selectedSite)}
              onMouseEnter={() => playHoverTick(soundEnabled)}
              className="w-full py-3 px-4 bg-[#3FF5E6] hover:bg-[#28dbc9] text-[#02060D] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(63,245,230,0.35)] cursor-pointer group"
            >
              <span>RUN TIDEMIND ANALYSIS →</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Live Toast Confirmation */}
            {toastMessage && (
              <div className="mt-3 p-2.5 bg-[#02060D] border border-[#3FF5E6] text-xs font-mono text-[#3FF5E6] animate-fadeIn flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <span>{toastMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
