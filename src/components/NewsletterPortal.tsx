import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { NewsletterArticle } from '../types';
import {
  Newspaper,
  Upload,
  Heart,
  ZoomIn,
  Download,
  Trash2,
  Lock,
  Sparkles,
  FileText,
  Calendar,
  User,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';

export const NewsletterPortal: React.FC = () => {
  const {
    newsletters,
    addNewsletter,
    deleteNewsletter,
    likeNewsletter,
    currentUser,
    isNewsletterHead,
  } = usePortal();

  // Form state for Newsletter Head upload
  const [articleTitle, setArticleTitle] = useState('');
  const [edition, setEdition] = useState('Vol. 14 · Autumn Issue');
  const [author, setAuthor] = useState(
    currentUser?.username ? `${currentUser.username} (Press Team)` : 'Editorial Board'
  );
  const [imageUrl, setImageUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [tagsStr, setTagsStr] = useState('Campus Life, Feature, Innovation');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [toastMessage, setToastMessage] = useState('');

  // Lightbox Zoom modal state
  const [zoomArticle, setZoomArticle] = useState<NewsletterArticle | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Dropzone file handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes('image')) {
        alert('Please attach a PNG or JPG graphic article file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const res = event.target.result as string;
          setImageUrl(res);
          setImagePreview(res);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const res = event.target.result as string;
          setImageUrl(res);
          setImagePreview(res);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !imageUrl.trim()) {
      alert('Please provide an article title and attach an article page image.');
      return;
    }

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addNewsletter({
      title: articleTitle.trim(),
      edition: edition.trim(),
      date: new Date().toISOString().split('T')[0],
      author: author.trim() || 'Newsletter Editorial',
      imageUrl: imageUrl.trim(),
      summary: summary.trim() || 'Official college newsletter page publication.',
      tags: tags.length ? tags : ['General'],
    });

    setArticleTitle('');
    setImageUrl('');
    setImagePreview('');
    setSummary('');
    showToast('Graphic article published to the campus feed!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Newspaper className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              The Campus Gazette & Newsletters
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            newsletter.jsp & NewsletterServlet.java · High-resolution graphic publications
          </p>
        </div>

        {/* Role badge */}
        <div>
          {isNewsletterHead ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Newsletter Head (Editor Access)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              General Reader View (Read-Only)
            </span>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {toastMessage}
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. NEWSLETTER HEAD VIEW: UPLOAD DROPZONE                  */}
      {/* ========================================================= */}
      {isNewsletterHead && (
        <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                Upload Graphic Article / Newsletter Page (PNG/JPG)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Drop high-resolution newsletter scans, graphic articles, or cover pages.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Newsletter Head Tool
            </span>
          </div>

          <form onSubmit={handlePublishArticle} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  placeholder="e.g. Fall Fest Musical Gala Highlights"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Edition / Issue Tag
                </label>
                <input
                  type="text"
                  value={edition}
                  onChange={(e) => setEdition(e.target.value)}
                  placeholder="e.g. Vol. 14 · Issue 3"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-slate-900"
                />
              </div>
            </div>

            {/* Dropzone Area */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-6 bg-emerald-50/30 text-center transition-colors cursor-pointer relative"
            >
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <div className="max-h-52 max-w-sm rounded-lg overflow-hidden border border-slate-200 shadow-sm mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs font-semibold text-emerald-800">
                    Image file loaded successfully!
                  </p>
                  <label className="text-xs text-indigo-600 hover:underline mt-1 cursor-pointer">
                    Change image file
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Drag and drop your PNG or JPG article image here
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports high-resolution scans, infographics, editorial spreads
                  </p>
                  <label className="mt-3 inline-block px-4 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold shadow-2xs cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Manual URL input fallback */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Or paste image URL directly
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                }}
                placeholder="https://... (or use dropzone above)"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Author / Byline
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Elena Rostova (Editor)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Comma-separated Tags
                </label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="Student Council, Science, Sports"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Summary / Editorial Caption
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of key stories featured on this page..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Publish Graphic Article
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. GENERAL USER VIEW: CLEAN VERTICAL FEED                  */}
      {/* ========================================================= */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Latest College Publications ({newsletters.length} Articles)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Scroll down to browse high-resolution editions
          </span>
        </div>

        {/* Clean Vertical Feed */}
        <div className="space-y-8">
          {newsletters.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Article Header Bar */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-indigo-700">{article.edition}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{article.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>By {article.author}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {article.title}
                  </h3>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => likeNewsletter(article.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span className="font-mono tabular-nums">{article.likes || 0}</span>
                  </button>

                  <button
                    onClick={() => setZoomArticle(article)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Zoom in high-resolution view"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  {/* Newsletter Head can delete articles */}
                  {isNewsletterHead && (
                    <button
                      onClick={() => {
                        deleteNewsletter(article.id);
                        showToast(`Removed article "${article.title}"`);
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                      title="Delete article (Newsletter Head Only)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* High-Resolution Graphic Article Page Image */}
              <div
                onClick={() => setZoomArticle(article)}
                className="relative bg-slate-100 max-h-[700px] overflow-hidden flex items-center justify-center cursor-zoom-in group"
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[700px] object-contain transition-transform duration-500 group-hover:scale-101"
                />
                <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5" />
                  Click to Expand Full Page
                </div>
              </div>

              {/* Caption & Editorial Text */}
              <div className="p-4 sm:p-5 bg-white">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {article.summary}
                </p>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-500">
                    <span className="font-semibold text-slate-400">Filed under:</span>
                    {article.tags.map((tag, idx) => (
                      <span key={idx} className="text-slate-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full-Page Lightbox Zoom Modal */}
      {zoomArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative max-w-5xl w-full max-h-[95vh] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] text-indigo-300 font-semibold">{zoomArticle.edition}</span>
                <h3 className="text-sm sm:text-base font-bold truncate max-w-lg">
                  {zoomArticle.title}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={zoomArticle.imageUrl}
                  download="newsletter_page.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Open Full File
                </a>
                <button
                  onClick={() => setZoomArticle(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable high-res page */}
            <div className="flex-1 overflow-auto p-4 bg-slate-100 flex items-center justify-center">
              <img
                src={zoomArticle.imageUrl}
                alt={zoomArticle.title}
                referrerPolicy="no-referrer"
                className="max-w-full h-auto rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
