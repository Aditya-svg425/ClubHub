import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  ShieldAlert,
  ShieldCheck,
  Building,
  Image as ImageIcon,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Calendar,
  Bell,
  Upload,
  RefreshCw,
} from 'lucide-react';

export const AdminWebsiteBuilder: React.FC = () => {
  const {
    currentUser,
    isStudentCouncil,
    collegeSettings,
    updateCollegeSettings,
    clubs,
    addClub,
    deleteClub,
    notices,
    addNotice,
    deleteNotice,
    calendarEvents,
    addCalendarEvent,
    deleteCalendarEvent,
    setActiveTab,
    resetToDefaults,
  } = usePortal();

  // Active admin sub-tab
  const [adminTab, setAdminTab] = useState<'header' | 'clubs' | 'notices' | 'calendar'>('header');
  const [toastMessage, setToastMessage] = useState<string>('');

  // 1. Header Configurator form state
  const [bannerUrl, setBannerUrl] = useState(collegeSettings.gateBannerUrl);
  const [logoUrl, setLogoUrl] = useState(collegeSettings.logoUrl);
  const [collegeName, setCollegeName] = useState(collegeSettings.collegeName);
  const [tagline, setTagline] = useState(collegeSettings.tagline);

  // 2. Club Shortcut Manager form state
  const [newClubName, setNewClubName] = useState('');
  const [newClubTargetUrl, setNewClubTargetUrl] = useState('https://instagram.com');
  const [newClubLogoUrl, setNewClubLogoUrl] = useState('');
  const [newClubCategory, setNewClubCategory] = useState<
    'Tech' | 'Cultural' | 'Sports' | 'Literary' | 'Social' | 'Academic' | 'Other'
  >('Tech');
  const [newClubDescription, setNewClubDescription] = useState('');

  // 3. Notice Board Manager form state
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeDept, setNewNoticeDept] = useState('');
  const [newNoticeDate, setNewNoticeDate] = useState('2026-10-20');
  const [newNoticeCat, setNewNoticeCat] = useState<
    'Academics' | 'Sports' | 'Cultural' | 'Examination' | 'General'
  >('Academics');
  const [newNoticePriority, setNewNoticePriority] = useState<'high' | 'normal'>('normal');
  const [newNoticeDesc, setNewNoticeDesc] = useState('');

  // 4. Calendar Event Manager form state
  const [newEventDate, setNewEventDate] = useState('2026-10-31');
  const [newEventName, setNewEventName] = useState('');
  const [newEventType, setNewEventType] = useState<'Holiday' | 'Big Event'>('Big Event');
  const [newEventVenue, setNewEventVenue] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Guard: Accessible exclusively by Student Council accounts
  if (!isStudentCouncil) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-rose-200 shadow-xs max-w-2xl mx-auto my-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">403 Access Restricted</h2>
        <p className="text-xs text-rose-700 font-semibold mt-1">
          AdminServlet.java Security Filter: Role 'Student Council' Required
        </p>
        <p className="text-xs text-slate-600 mt-3 leading-relaxed max-w-md mx-auto">
          You are currently signed in as <strong className="text-slate-900">{currentUser?.username || 'Guest'}</strong> with role <span className="font-semibold text-rose-600">{currentUser?.role || 'None'}</span>. Only authorized Student Council representatives may edit website banners, club shortcuts, notices, and calendar items.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => setActiveTab('club-hub')}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-indigo-700 cursor-pointer"
          >
            Return to Club Hub
          </button>
        </div>
      </div>
    );
  }

  // Handle image upload from computer (FileReader)
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBannerUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    updateCollegeSettings({
      gateBannerUrl: bannerUrl,
      logoUrl: logoUrl,
      collegeName: collegeName,
      tagline: tagline,
    });
    showToast('College Header & Banner updated successfully!');
  };

  const handleAddClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClubName.trim() || !newClubTargetUrl.trim()) return;

    addClub({
      name: newClubName.trim(),
      targetUrl: newClubTargetUrl.trim(),
      logoUrl:
        newClubLogoUrl.trim() ||
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg',
      category: newClubCategory,
      description: newClubDescription.trim() || 'Official registered campus club organization.',
      memberCount: 40,
    });

    setNewClubName('');
    setNewClubTargetUrl('https://instagram.com');
    setNewClubLogoUrl('');
    setNewClubDescription('');
    showToast('New club shortcut added to database!');
  };

  const handleAddNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeDept.trim()) return;

    addNotice({
      title: newNoticeTitle.trim(),
      department: newNoticeDept.trim(),
      date: newNoticeDate,
      category: newNoticeCat,
      priority: newNoticePriority,
      description:
        newNoticeDesc.trim() ||
        'Important campus circular issued by organizing department.',
    });

    setNewNoticeTitle('');
    setNewNoticeDept('');
    setNewNoticeDesc('');
    showToast('Notice published to Notice Board!');
  };

  const handleAddCalendarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim() || !newEventDate.trim()) return;

    addCalendarEvent({
      name: newEventName.trim(),
      date: newEventDate,
      type: newEventType,
      venue: newEventVenue.trim() || 'University Campus Grounds',
      description: newEventDesc.trim() || 'Institutional calendar event.',
    });

    setNewEventName('');
    setNewEventVenue('');
    setNewEventDesc('');
    showToast('Event added to Campus Calendar!');
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Website Builder (Admin Panel)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            edit-website.jsp & AdminServlet.java · Exclusive Student Council Access
          </p>
        </div>

        <div className="flex items-center gap-2">
          {toastMessage && (
            <div className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {toastMessage}
            </div>
          )}
          <button
            onClick={resetToDefaults}
            className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium"
            title="Reset all sample data to default"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Data
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setAdminTab('header')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            adminTab === 'header'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Header & Banner Configurator
        </button>
        <button
          onClick={() => setAdminTab('clubs')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            adminTab === 'clubs'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Club Shortcuts Manager
        </button>
        <button
          onClick={() => setAdminTab('notices')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            adminTab === 'notices'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Notice Board Manager
        </button>
        <button
          onClick={() => setAdminTab('calendar')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            adminTab === 'calendar'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          4. Calendar Events Manager
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: HEADER CONFIGURATOR                                */}
      {/* ========================================================= */}
      {adminTab === 'header' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Header & College Gate Banner Configurator</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the official College Gate Banner and College Crest Logo displayed at the top of the portal.
            </p>
          </div>

          <form onSubmit={handleSaveHeader} className="space-y-5">
            {/* Live Preview Box */}
            <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                Live Header Preview
              </span>
              <div className="relative h-28 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-200">
                <img
                  src={bannerUrl}
                  alt="Banner preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                <div className="absolute bottom-2 left-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-md border border-slate-200 overflow-hidden">
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{collegeName}</h4>
                    <p className="text-[10px] text-slate-600">{tagline}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College Gate Banner Image URL
                </label>
                <input
                  type="text"
                  required
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://... or /src/assets/..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900"
                />
                <div className="mt-1 flex items-center gap-2">
                  <label className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer inline-flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    Or upload file from PC
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College Logo / Crest Image URL
                </label>
                <input
                  type="text"
                  required
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://... or /src/assets/..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900"
                />
                <div className="mt-1 flex items-center gap-2">
                  <label className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer inline-flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    Or upload crest file from PC
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official College Name
                </label>
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. Brighton University of Excellence"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campus Motto / Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Fostering Innovation & Leadership"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Save & Apply Header Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CLUB SHORTCUT MANAGER                              */}
      {/* ========================================================= */}
      {adminTab === 'clubs' && (
        <div className="space-y-6">
          {/* Add Club Shortcut Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Add Club Shortcut</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Input fields: Club Name, Club Target URL, Club Logo Image URL. Adds round shortcut icon to Club Hub.
              </p>
            </div>

            <form onSubmit={handleAddClubSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Club Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClubName}
                    onChange={(e) => setNewClubName(e.target.value)}
                    placeholder="e.g. Solar Car Racing Syndicate"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Club Target URL (External Link) *
                  </label>
                  <input
                    type="url"
                    required
                    value={newClubTargetUrl}
                    onChange={(e) => setNewClubTargetUrl(e.target.value)}
                    placeholder="https://instagram.com/myclub"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Club Logo Image URL
                  </label>
                  <input
                    type="text"
                    value={newClubLogoUrl}
                    onChange={(e) => setNewClubLogoUrl(e.target.value)}
                    placeholder="https://... (or leave empty for icon)"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newClubCategory}
                    onChange={(e) => setNewClubCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-900"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Literary">Literary</option>
                    <option value="Social">Social</option>
                    <option value="Academic">Academic</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={newClubDescription}
                    onChange={(e) => setNewClubDescription(e.target.value)}
                    placeholder="Purpose and activities of the club"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Club Shortcut
                </button>
              </div>
            </form>
          </div>

          {/* List of Existing Clubs with Remove Button */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Existing Club Shortcuts ({clubs.length})
              </h3>
              <span className="text-xs text-slate-500">
                Click "Remove" to delete any club record from database
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 p-1.5 shrink-0 flex items-center justify-center">
                      <img
                        src={club.logoUrl}
                        alt={club.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {club.name}
                        </span>
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {club.category}
                        </span>
                      </div>
                      <a
                        href={club.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 truncate"
                      >
                        {club.targetUrl} <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        deleteClub(club.id);
                        showToast(`Removed "${club.name}" from database.`);
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: NOTICE BOARD MANAGER                               */}
      {/* ========================================================= */}
      {adminTab === 'notices' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Notice Board Manager</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Input fields: Event Title, Organizing Department/Club, Event Date.
              </p>
            </div>

            <form onSubmit={handleAddNoticeSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    placeholder="e.g. Annual Blood Donation Camp Registrations"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newNoticeDate}
                    onChange={(e) => setNewNoticeDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organizing Department / Club *
                  </label>
                  <input
                    type="text"
                    required
                    value={newNoticeDept}
                    onChange={(e) => setNewNoticeDept(e.target.value)}
                    placeholder="e.g. Rotaract Club & NSS Unit"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Notice Category
                  </label>
                  <select
                    value={newNoticeCat}
                    onChange={(e) => setNewNoticeCat(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-900"
                  >
                    <option value="Academics">Academics</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Examination">Examination</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority Alert Tag
                  </label>
                  <select
                    value={newNoticePriority}
                    onChange={(e) => setNewNoticePriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-900"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority (Red Tag)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Circular Description
                </label>
                <textarea
                  rows={2}
                  value={newNoticeDesc}
                  onChange={(e) => setNewNoticeDesc(e.target.value)}
                  placeholder="Details, venue, criteria, registration deadlines..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-900"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Publish Notice
                </button>
              </div>
            </form>
          </div>

          {/* List of Existing Notices with Delete button */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Active Notices ({notices.length})
              </h3>
              <span className="text-xs text-slate-500">
                Removes notice from the scrolling notice board
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          n.priority === 'high'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {n.category}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {n.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{n.department}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{n.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      deleteNotice(n.id);
                      showToast(`Deleted notice: "${n.title}"`);
                    }}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: CALENDAR EVENT MANAGER                             */}
      {/* ========================================================= */}
      {adminTab === 'calendar' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Calendar Event Manager</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Input fields: Event Date, Event Name, Type (Holiday or Big Event).
              </p>
            </div>

            <form onSubmit={handleAddCalendarSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    placeholder="e.g. Annual Convocation Ceremony"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Classification (Type) *
                  </label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-900 font-semibold"
                  >
                    <option value="Holiday">College Holiday (Red Highlight)</option>
                    <option value="Big Event">Big Campus Event (Blue Highlight)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campus Venue / Location
                  </label>
                  <input
                    type="text"
                    value={newEventVenue}
                    onChange={(e) => setNewEventVenue(e.target.value)}
                    placeholder="e.g. University Stadium / Main Quad"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description & Schedule
                  </label>
                  <input
                    type="text"
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                    placeholder="Timings, guidelines, who is eligible to attend"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>

          {/* List of Existing Calendar Events with Delete button */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Scheduled Calendar Events ({calendarEvents.length})
              </h3>
              <span className="text-xs text-slate-500">
                Red = Holiday · Blue = Big Event
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {calendarEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          ev.type === 'Holiday'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {ev.type}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">{ev.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono font-medium text-slate-700">{ev.date}</span>
                      {ev.venue && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{ev.venue}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      deleteCalendarEvent(ev.id);
                      showToast(`Deleted event: "${ev.name}"`);
                    }}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
