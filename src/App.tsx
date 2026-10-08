/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ClubHubView } from './components/ClubHubView';
import { RightSidebar } from './components/RightSidebar';
import { AdminWebsiteBuilder } from './components/AdminWebsiteBuilder';
import { NewsletterPortal } from './components/NewsletterPortal';
import { CollegeMap } from './components/CollegeMap';
import { AuthModal } from './components/AuthModal';
import { ShieldCheck, Newspaper, UserCheck, KeyRound, Sparkles } from 'lucide-react';

const MainPortalContent: React.FC = () => {
  const {
    activeTab,
    currentUser,
    switchUser,
    allUsers,
  } = usePortal();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans">
      {/* Quick Role Tester Bar for Evaluators (strictly in light mode) */}
      <aside aria-label="Role Access Demo Bar" className="bg-white border-b border-slate-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-bold text-slate-900">Role Access & Permissions Demo:</span>
          <span className="text-slate-500 hidden sm:inline">
            Switch persona to test role-based access:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {allUsers.slice(0, 3).map((user) => {
            const isActive = currentUser?.id === user.id;
            return (
              <button
                key={user.id}
                onClick={() => switchUser(user.id)}
                className={`px-2.5 py-1 rounded-lg font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? user.role === 'Student Council'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-2xs'
                      : user.role === 'Newsletter Head'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold shadow-2xs'
                      : 'bg-blue-100 text-blue-900 border border-blue-300 font-bold shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {user.role === 'Student Council' && <ShieldCheck className="w-3 h-3 text-amber-700" />}
                {user.role === 'Newsletter Head' && <Newspaper className="w-3 h-3 text-emerald-700" />}
                {user.role === 'Club Head / General User' && <UserCheck className="w-3 h-3 text-blue-700" />}
                <span>{user.role.split(' ')[0]}</span>
                {isActive && <span className="text-[10px] bg-white/70 px-1 rounded">Active</span>}
              </button>
            );
          })}

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline ml-1 cursor-pointer"
          >
            Open Auth (index.jsp)
          </button>
        </div>
      </aside>

      {/* Official College Header with Top Center Crest & Gate Banner */}
      <Header onOpenAuth={() => setIsAuthModalOpen(true)} />

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-6">
        {/* Left Navigation Sidebar */}
        <Sidebar onOpenAuth={() => setIsAuthModalOpen(true)} />

        {/* Central Content View */}
        <main className="flex-1 min-w-0">
          {activeTab === 'club-hub' && <ClubHubView />}
          {activeTab === 'newsletter' && <NewsletterPortal />}
          {activeTab === 'map' && <CollegeMap />}
          {activeTab === 'admin-builder' && <AdminWebsiteBuilder />}
        </main>

        {/* Right Sidebar: Notice Board & Interactive Calendar (visible on Club Hub & Admin tabs) */}
        {(activeTab === 'club-hub' || activeTab === 'admin-builder') && (
          <RightSidebar />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ClubHub</span>
            <span>·</span>
            <span>All-in-One College Student Portal</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>index.jsp · dashboard.jsp · edit-website.jsp · newsletter.jsp · map.jsp</span>
          </div>
        </div>
      </footer>

      {/* Authentication Modal / Registration Dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <PortalProvider>
      <MainPortalContent />
    </PortalProvider>
  );
}
