import React, { useState, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { ClubShortcut } from '../types';
import {
  Search,
  ExternalLink,
  Users,
  Calendar,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronRight,
  Plus,
  Compass,
} from 'lucide-react';

export const ClubHubView: React.FC = () => {
  const { clubs, isStudentCouncil, setActiveTab } = usePortal();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClub, setSelectedClub] = useState<ClubShortcut | null>(null);

  const categories = ['All', 'Tech', 'Cultural', 'Sports', 'Literary', 'Social', 'Academic'];

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const matchesCategory =
        selectedCategory === 'All' || club.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [clubs, selectedCategory, searchQuery]);

  const handleShortcutClick = (club: ClubShortcut, e: React.MouseEvent) => {
    // If user clicked the info button specifically, don't open link
    if ((e.target as HTMLElement).closest('.info-trigger')) {
      e.stopPropagation();
      setSelectedClub(club);
      return;
    }

    // Default Chrome-style shortcut behavior: opens target URL in new tab
    if (club.targetUrl) {
      window.open(club.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Club Hub</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant shortcuts to registered student organizations, creative societies & varsity clubs
            </p>
          </div>

          {/* Search box & Admin button */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clubs & syndicates..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900"
              />
            </div>

            {isStudentCouncil && (
              <button
                onClick={() => setActiveTab('admin-builder')}
                className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Club</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 border-t border-slate-100 mt-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-xs text-slate-600 ml-auto pl-2 font-mono tabular-nums shrink-0">
            {filteredClubs.length} {filteredClubs.length === 1 ? 'club' : 'clubs'}
          </span>
        </div>
      </div>

      {/* Chrome-Style Round Shortcut Icons Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Campus Web Shortcuts</h3>
          </div>
          <span className="text-[11px] text-slate-600">
            Click shortcut icon to launch official portal / Instagram
          </span>
        </div>

        {filteredClubs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <Compass className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No clubs matched your search</p>
            <p className="text-xs text-slate-600 mt-1">Try another category or clear your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-8 justify-items-center">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                onClick={(e) => handleShortcutClick(club, e)}
                className="group flex flex-col items-center w-28 sm:w-32 cursor-pointer transition-transform hover:-translate-y-1"
                title={`Open ${club.name} (${club.targetUrl})`}
              >
                {/* Chrome-Style Round Shortcut Icon Container */}
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 group-hover:bg-indigo-50 border border-slate-200 group-hover:border-indigo-300 shadow-xs group-hover:shadow-md transition-all flex items-center justify-center p-3 overflow-hidden">
                    {club.logoUrl ? (
                      <img
                        src={club.logoUrl}
                        alt={club.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-full group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to stylized initials if image fails
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
                        {club.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Corner Quick Info Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedClub(club);
                    }}
                    className="info-trigger absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-xs text-slate-500 hover:text-indigo-600 hover:border-indigo-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="View details & meetings"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Chrome-Style Name Label Below */}
                <div className="mt-2.5 text-center w-full px-1">
                  <span className="block text-xs font-semibold text-slate-800 group-hover:text-indigo-600 truncate transition-colors">
                    {club.name}
                  </span>
                  <span className="block text-[10px] text-slate-600 truncate">
                    {club.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Clubs Highlights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clubs.slice(0, 2).map((featured) => (
          <div
            key={`featured-${featured.id}`}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-start gap-3.5 hover:border-indigo-200 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 p-2 shrink-0 flex items-center justify-center">
              <img
                src={featured.logoUrl}
                alt={featured.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 truncate">{featured.name}</h4>
                <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {featured.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{featured.description}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                <span>Leads: {featured.leads || 'Student Council'}</span>
                <span aria-hidden="true">·</span>
                <a
                  href={featured.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
                >
                  Visit Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Club Details Modal */}
      {selectedClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 p-2 flex items-center justify-center">
                  <img
                    src={selectedClub.logoUrl}
                    alt={selectedClub.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedClub.name}</h3>
                  <span className="text-xs text-indigo-600 font-semibold">{selectedClub.category} Club</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedClub(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-4 leading-relaxed">
              {selectedClub.description}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
              {selectedClub.leads && (
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-400">Club Leaders:</span>
                  <span className="font-semibold text-slate-900">{selectedClub.leads}</span>
                </div>
              )}
              {selectedClub.meetingSchedule && (
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-400">Regular Meetings:</span>
                  <span className="font-semibold text-slate-900">{selectedClub.meetingSchedule}</span>
                </div>
              )}
              {selectedClub.memberCount && (
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-400">Active Members:</span>
                  <span className="font-semibold text-slate-900 font-mono tabular-nums">
                    {selectedClub.memberCount} Students
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={selectedClub.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                Open External Portal / Link
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedClub(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
