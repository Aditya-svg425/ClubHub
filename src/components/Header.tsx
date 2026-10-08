import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { ShieldCheck, Newspaper, UserCheck, LogOut, Sparkles, Building, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth }) => {
  const {
    currentUser,
    collegeSettings,
    allUsers,
    switchUser,
    logout,
    setActiveTab,
  } = usePortal();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Student Council':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            Student Council (Admin)
          </span>
        );
      case 'Newsletter Head':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Newspaper className="w-3.5 h-3.5 text-emerald-600" />
            Newsletter Head
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            Club Head / Student
          </span>
        );
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Gate Banner & Official Crest Section */}
      <div className="relative w-full h-36 sm:h-44 md:h-52 bg-slate-100 overflow-hidden group">
        <img
          src={collegeSettings.gateBannerUrl}
          alt={`${collegeSettings.collegeName} Gate Banner`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-102"
        />
        {/* Subtle Light Scrim for optimal contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-black/20" />

        {/* Top-right quick switch bar */}
        <div className="absolute top-3 right-4 flex items-center gap-2">
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 text-xs font-medium text-slate-800 hover:bg-white hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-semibold">{currentUser.username}</span>
                <span className="text-slate-400">·</span>
                <span className="text-indigo-600 font-medium">{currentUser.role.split(' ')[0]}</span>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 text-left z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900">{currentUser.username}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <div className="mt-1.5">{getRoleBadge(currentUser.role)}</div>
                  </div>

                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Quick Role Switch (Demo)
                  </div>
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        u.id === currentUser.id
                          ? 'bg-indigo-50 font-semibold text-indigo-900'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-medium">{u.username}</div>
                        <div className="text-[10px] text-slate-500">{u.role}</div>
                      </div>
                      {u.id === currentUser.id && (
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono">
                          Active
                        </span>
                      )}
                    </button>
                  ))}

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                        onOpenAuth();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!currentUser && (
            <button
              onClick={onOpenAuth}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Sign In / Register
            </button>
          )}
        </div>

        {/* Central Logo & College Identity */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center translate-y-7 sm:translate-y-9 pointer-events-none">
          <div className="relative pointer-events-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white p-1 shadow-lg border-2 border-white ring-1 ring-slate-200 overflow-hidden flex items-center justify-center">
              <img
                src={collegeSettings.logoUrl}
                alt={`${collegeSettings.collegeName} Crest`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* College Identity Details */}
      <div className="pt-10 sm:pt-11 pb-3 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          {collegeSettings.collegeName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5 line-clamp-1">
          {collegeSettings.tagline}
        </p>

        {/* Active Session Info Pill */}
        {currentUser && (
          <div className="mt-2.5 flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 font-medium">Logged in as:</span>
            <span className="font-semibold text-slate-900">{currentUser.username}</span>
            <span className="text-slate-300">·</span>
            {getRoleBadge(currentUser.role)}
            {currentUser.role === 'Student Council' && (
              <button
                onClick={() => setActiveTab('admin-builder')}
                className="ml-2 text-indigo-600 hover:text-indigo-800 font-semibold underline text-xs cursor-pointer"
              >
                Open Admin Panel →
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
