import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  MapPin,
  Compass,
  Search,
  Building,
  Clock,
  Phone,
  Navigation,
  ExternalLink,
  Layers,
  Info,
} from 'lucide-react';

interface CampusLocation {
  id: string;
  code: string;
  name: string;
  category: 'Academic' | 'Admin' | 'Library' | 'Sports' | 'Housing' | 'Amenities';
  departments: string[];
  hours: string;
  phone: string;
  description: string;
  coords: { x: number; y: number }; // Percentage on map image
}

const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'loc-a1',
    code: 'A1',
    name: 'Arts, Design & Humanities Block',
    category: 'Academic',
    departments: ['Literature & Languages', 'Visual Arts & Media', 'Philosophy', 'History'],
    hours: '08:00 AM – 09:00 PM',
    phone: 'Ext. 4101',
    description: 'Home to the humanities lecture halls, sculpture studios, digital media labs, and language recording booths.',
    coords: { x: 17, y: 46 },
  },
  {
    id: 'loc-a2',
    code: 'A2',
    name: 'Science & Technology Complex',
    category: 'Academic',
    departments: ['Computer Science', 'Robotics & AI Lab', 'Physics & Nanotech', 'Chemistry'],
    hours: '24/7 Access for Research Scholars',
    phone: 'Ext. 5200',
    description: 'State-of-the-art computational clusters, cleanrooms, robotics testing arenas, and faculty chambers.',
    coords: { x: 28, y: 35 },
  },
  {
    id: 'loc-b1',
    code: 'B1',
    name: 'Central Administration Block',
    category: 'Admin',
    departments: ["President's Office", 'Registrar', 'Student Welfare Desk', 'Accounts & Fee Counter'],
    hours: '09:00 AM – 05:00 PM (Mon–Fri)',
    phone: 'Ext. 1000',
    description: 'Central administrative headquarters, student verification, international admissions, and transcript dispatch.',
    coords: { x: 23, y: 60 },
  },
  {
    id: 'loc-b2',
    code: 'B2',
    name: 'Central Library & Digital Commons',
    category: 'Library',
    departments: ['Archival Collections', 'Silent Reading Floors 1-3', 'Collaborative Pods', 'Midnight Cafe'],
    hours: '24/7 During Exam Term (Otherwise 07:00 AM – Midnight)',
    phone: 'Ext. 2100',
    description: 'Over 400,000 physical volumes, 2 million digital subscriptions, private study carrels, and cafe terrace.',
    coords: { x: 31, y: 67 },
  },
  {
    id: 'loc-c',
    code: 'C',
    name: 'Grand Convocation Auditorium',
    category: 'Amenities',
    departments: ['Cultural Affairs', 'Theater Arts Guild', 'Acoustic Symphony Hall'],
    hours: 'Event Dependent',
    phone: 'Ext. 3500',
    description: '2,500-seat acoustic concert hall hosting orientation ceremonies, national symposiums, and cultural fests.',
    coords: { x: 55, y: 39 },
  },
  {
    id: 'loc-d',
    code: 'D',
    name: 'Olympic Sports Complex & Stadium',
    category: 'Sports',
    departments: ['Varsity Athletics', 'Olympic Swimming Pool', 'Indoor Courts', 'Fitness Gymnasium'],
    hours: '06:00 AM – 10:00 PM',
    phone: 'Ext. 7000',
    description: '400m synthetic running track, full FIFA-grade soccer pitch, heated indoor pool, and strength training centers.',
    coords: { x: 53, y: 74 },
  },
  {
    id: 'loc-h',
    code: 'H1 & H2',
    name: 'North Campus Residential Towers',
    category: 'Housing',
    departments: ['Undergraduate Dorms', 'Dining Hall West', 'Resident Tutors Office'],
    hours: 'Resident Card Access Only',
    phone: 'Ext. 9110',
    description: 'Modern student accommodations with recreation lounges, laundry facilities, and lakeview courtyards.',
    coords: { x: 74, y: 38 },
  },
  {
    id: 'loc-quad',
    code: 'Quad',
    name: 'Central Green Quadrangle & Fountain',
    category: 'Amenities',
    departments: ['Student Open Forums', 'Botanical Lawns', 'Solar WiFi Pavilions'],
    hours: 'Open Day & Night',
    phone: 'Security Ext. 0000',
    description: 'The historic heart of Brighton campus where students gather for club fairs, open-air concerts, and relaxation.',
    coords: { x: 40, y: 52 },
  },
];

export const CollegeMap: React.FC = () => {
  const { collegeSettings } = usePortal();
  const [viewMode, setViewMode] = useState<'layout' | 'google-maps'>('layout');
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(
    CAMPUS_LOCATIONS[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Academic', 'Admin', 'Library', 'Sports', 'Housing', 'Amenities'];

  const filteredLocations = CAMPUS_LOCATIONS.filter((loc) => {
    const matchesCat = categoryFilter === 'All' || loc.category === categoryFilter;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.departments.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
              <MapPin className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Interactive College Campus Map
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            map.jsp · High-resolution architectural master plan layout & building directory
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setViewMode('layout')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'layout'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Architectural Campus Layout
          </button>
          <button
            onClick={() => setViewMode('google-maps')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'google-maps'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Live Google Map View
          </button>
        </div>
      </div>

      {/* Main Map Presentation */}
      {viewMode === 'layout' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Map Area */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-semibold text-slate-800">
                Master Plan: Click on any marker to inspect building
              </span>
              <span className="text-[11px] font-mono">Orientation: North-West Facing</span>
            </div>

            {/* Architectural Layout Map Container with interactive pins */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">
              <img
                src="/src/assets/images/campus_overview_map_1791475634201.jpg"
                alt="Campus Master Plan Map"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover"
              />

              {/* Interactive Hotspot Pins */}
              {CAMPUS_LOCATIONS.map((loc) => {
                const isSelected = selectedLocation?.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-10'
                    }`}
                    title={`${loc.code}: ${loc.name}`}
                  >
                    <div
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full shadow-lg font-bold text-[10px] border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-white ring-2 ring-indigo-400'
                          : 'bg-white/95 text-slate-800 border-slate-300 hover:bg-indigo-50 hover:text-indigo-700'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-red-500 fill-red-500" />
                      <span>{loc.code}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick legend chips */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-2 px-1 text-[11px] text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Academic (A1, A2)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Administration (B1)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Library (B2)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Athletics (D)
                </span>
              </div>
            </div>
          </div>

          {/* Building Details Card & Directory */}
          <div className="space-y-4">
            {/* Selected Location Card */}
            {selectedLocation ? (
              <div className="bg-white rounded-2xl p-5 border border-indigo-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-mono font-bold text-xs">
                      Block {selectedLocation.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {selectedLocation.category}
                    </span>
                  </div>
                  <span className="text-xs text-indigo-600 font-medium">Selected Pin</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2.5">
                  {selectedLocation.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {selectedLocation.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{selectedLocation.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{selectedLocation.phone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Departments & Facilities Housed:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLocation.departments.map((dept, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-700"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Searchable Directory */}
            <div className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Building Directory
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  {filteredLocations.length} locations
                </span>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search blocks or departments..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white text-slate-900"
                />
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto no-scrollbar">
                {filteredLocations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      selectedLocation?.id === loc.id
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 shrink-0">
                        {loc.code}
                      </span>
                      <span className="truncate">{loc.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Embedded Interactive Google Map iframe view */
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Embedded Campus Satellite & Street Map (Google Maps)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Live interactive map iframe showing campus coordinates and navigation routes
              </p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium"
            >
              Open in Google Maps App <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="w-full h-[520px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
            <iframe
              title="Brighton University Campus Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Brighton%20University&t=&z=15&ie=UTF8&iwloc=&output=embed"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span><strong>Campus Address:</strong> {collegeSettings.location}</span>
            <span><strong>Campus Shuttle:</strong> Departs every 15 minutes from Main Gate Arch</span>
          </div>
        </div>
      )}
    </div>
  );
};
