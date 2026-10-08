import React from 'react';
import { usePortal, PortalTab } from '../context/PortalContext';
import {
  LayoutGrid,
  Newspaper,
  MapPin,
  Settings,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ChevronRight,
  School,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAuth }) => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    isStudentCouncil,
    collegeSettings,
  } = usePortal();

  const navItems = [
    {
      id: 'club-hub' as PortalTab,
      label: 'View Club Hub',
      icon: LayoutGrid,
      description: 'Official student organizations & shortcuts',
      badge: 'Default',
      restricted: false,
    },
    {
      id: 'newsletter' as PortalTab,
      label: 'Read Newsletter',
      icon: Newspaper,
      description: 'The Campus Gazette & articles',
      restricted: false,
    },
    {
      id: 'map' as PortalTab,
      label: 'College Map',
      icon: MapPin,
      description: 'Interactive campus grounds & buildings',
      restricted: false,
    },
    // Edit Website (Visible ONLY if session.getAttribute("role").equals("Student Council"))
    ...(isStudentCouncil
      ? [
          {
            id: 'admin-builder' as PortalTab,
            label: 'Edit Website',
            icon: Settings,
            description: 'Header, Clubs, Notices & Calendar',
            badge: 'Admin Only',
            restricted: false,
          },
        ]
      : []),
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0">
      {/* Brand & Portal Title */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black shadow-xs">
            CH
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base leading-none">ClubHub</h2>
            <span className="text-[11px] text-slate-500 font-medium">Campus Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 group-hover:text-indigo-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-sm leading-snug truncate">{item.label}</div>
                  <div
                    className={`text-[11px] truncate ${
                      isActive ? 'text-indigo-100' : 'text-slate-600'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-2 shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.id === 'admin-builder'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Role Access Information / Java Servlet Session representation */}
      <div className="mt-auto p-3.5 border-t border-slate-100 space-y-3">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs text-slate-600 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Session Attributes</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500">role:</span>
              <span className="font-semibold text-indigo-700 truncate max-w-[130px]">
                {currentUser ? currentUser.role : 'Guest'}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500">college:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[130px]" title={collegeSettings.collegeName}>
                {collegeSettings.collegeName.split(' ')[0]} Univ
              </span>
            </div>
          </div>

          {/* Quick permissions cheat note */}
          <div className="text-[11px] pt-1 text-slate-600 border-t border-slate-200">
            {isStudentCouncil ? (
              <span className="text-amber-800 font-medium">
                Admin Panel unlocked. You can edit clubs, banner, notices & calendar.
              </span>
            ) : currentUser?.role === 'Newsletter Head' ? (
              <span className="text-emerald-800 font-medium">
                Newsletter Head unlocked. You can publish articles in Newsletter.
              </span>
            ) : (
              <span className="text-slate-700">
                General View: Read-only access to notices & calendar.
              </span>
            )}
          </div>
        </div>

        {!currentUser && (
          <button
            onClick={onOpenAuth}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Sign In to ClubHub
          </button>
        )}
      </div>
    </aside>
  );
};
