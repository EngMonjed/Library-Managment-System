import { useState } from "react";
import AuthorsPage from "./AuthorsPage";
import BooksPage from "./BooksPage";
import PublishersPage from "./PublishersPage";

const NAV_ITEMS = [
  { key: "main", label: "الرئيسية", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg>) },
  { key: "branches", label: "الفروع", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>) },
  { key: "books", label: "الكتب", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>) },
  { key: "publishers", label: "دور النشر", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8m-4-4v4" /></svg>) },
  { key: "authors", label: "المؤلفون", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>) },
  { key: "borrowings", label: "الاستعارات", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M16 3H1v18h15" /><path d="M8 21l8-9-8-9" /></svg>) },
  { key: "fines", label: "الغرامات", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>) },
  { key: "reports", label: "التقارير", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>) },
  { key: "users", label: "المستخدمون", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>) },
  { key: "profile", label: "الملف الشخصي", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>) },
  { key: "notifications", label: "الإشعارات", badge: 4, icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>) },
];
const STATS = [
  { label: "إجمالي الكتب", value: "12,480", change: "+3.2%", up: true },
  { label: "الاستعارات النشطة", value: "1,093", change: "+8.1%", up: true },
  { label: "التسليمات المتأخرة", value: "47", change: "-12%", up: false },
  { label: "الغرامات المعلقة", value: "2,340 ر.س", change: "-5.4%", up: false },
  { label: "المستخدمون المسجلون", value: "3,821", change: "+1.7%", up: true },
  { label: "إجمالي الفروع", value: "8", change: "0%", up: true },
];
const RECENT_BORROWINGS = [
  { user: "أحمد حسن", book: "الكود النظيف", due: "2 أبريل", status: "نشط" },
  { user: "سارة علي", book: "غاتسبي العظيم", due: "30 مارس", status: "متأخر" },
  { user: "عمر خالد", book: "أنماط التصميم", due: "8 أبريل", status: "نشط" },
  { user: "لينا محمود", book: "العادات الذرية", due: "28 مارس", status: "متأخر" },
  { user: "يوسف ناصر", book: "المبرمج العملي", due: "15 أبريل", status: "نشط" },
];

export default function DashboardLayout({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("main");

  const activeLabel = NAV_ITEMS.find(n => n.key === active)?.label ?? "الرئيسية";

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full bg-slate-100 overflow-hidden"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar — fixed to the RIGHT in RTL ── */}
      <aside
        style={{ right: 0, left: "auto" }}
        className={`
          fixed lg:static z-30 h-full flex flex-col bg-slate-900
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-16" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo row */}
        <div className={`flex items-center h-16 px-3 border-b border-slate-700/60 ${collapsed ? "justify-center" : "justify-between"}`}>
          {/* Brand */}
          <div className={`flex items-center gap-2.5 ${collapsed ? "" : "flex-row-reverse"}`}>
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
            </div>
            {!collapsed && (
              <span className="text-white font-bold text-sm whitespace-nowrap">نظام المكتبة</span>
            )}
          </div>

          {/* Collapse / expand button */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="text-slate-400 hover:text-white p-1.5 rounded-md hover:bg-slate-700 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M13 17l5-5-5-5" /><path d="M6 17l5-5-5-5" />
              </svg>
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              style={{ position: "absolute", left: "-12px", top: "20px" }}
              className="w-6 h-6 bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setActive(item.key); setMobileOpen(false); }}
                title={collapsed ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                  transition-all duration-150 relative group
                  ${collapsed ? "justify-center" : "flex-row-reverse"}
                  ${isActive
                    ? "bg-amber-400/15 text-amber-400"
                    : "text-slate-400 hover:bg-slate-700/60 hover:text-slate-100"}
                `}
              >
                {/* Icon */}
                <span className="relative shrink-0">
                  {item.icon}
                  {item.badge && collapsed && (
                    <span className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </span>

                {/* Label + badge */}
                {!collapsed && (
                  <span className="flex-1 flex items-center justify-between flex-row-reverse">
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 leading-none">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}

                {/* Active indicator on the right edge */}
                {isActive && (
                  <span
                    style={{ right: 0 }}
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-400 rounded-l-full"
                  />
                )}

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <span
                    style={{ right: "100%", marginRight: "12px" }}
                    className="absolute px-2 py-1 bg-slate-800 text-slate-100 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-700"
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div className={`border-t border-slate-700/60 p-3 ${collapsed ? "flex justify-center" : ""}`}>
          <div className={`flex items-center gap-3 ${collapsed ? "" : "flex-row-reverse"}`}>
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-900 font-bold text-sm">
                م
              </div>
              <span
                style={{ top: "-2px", left: "-2px" }}
                className="absolute w-3.5 h-3.5 bg-red-500 border-2 border-slate-900 rounded-full flex items-center justify-center"
              >
                <span className="text-white leading-none" style={{ fontSize: "7px" }}>4</span>
              </span>
            </div>
            {!collapsed && (
              <div className="text-right overflow-hidden">
                <p className="text-white text-xs font-semibold truncate">المدير العام</p>
                <p className="text-slate-400 text-xs truncate">admin@library.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          {/* Right: burger + title */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-slate-500 hover:text-slate-800 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 text-white px-4 py-1.5 rounded-lg font-bold text-sm shadow-sm leading-tight flex items-center justify-center">
                {activeLabel}
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block"></span>
              <p className="text-slate-500 text-sm hidden sm:block mt-0.5">
                {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          {/* Left: search + bell + avatar */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-50 bg-slate-100 rounded-lg px-3 py-2 text-slate-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <span className="text-xs hidden lg:block">بحث عن كتاب / مؤلف / ناشر </span>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <div
              onClick={onLogout}
              title="تسجيل الخروج"
              className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-900 font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity"
            >
              م
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {active === "main" ? (
            <div className="space-y-5">

              {/* Welcome banner */}
              <div className="bg-slate-900 rounded-2xl p-5 flex items-center justify-between overflow-hidden relative">
                <div className="absolute left-0 top-0 w-48 h-full opacity-5 pointer-events-none">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="50" cy="50" r="80" fill="white" />
                    <circle cx="150" cy="150" r="60" fill="white" />
                  </svg>
                </div>
                <div className="hidden sm:flex items-center justify-center bg-amber-400/10 border border-amber-400/20 rounded-xl px-5 py-3">
                  <div className="text-center">
                    <p className="text-amber-400 font-bold text-2xl">47</p>
                    <p className="text-slate-400 text-xs mt-0.5">متأخر اليوم</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm mb-1">مرحباً،</p>
                  <h2 className="text-white font-bold text-xl">المدير العام 👋</h2>
                  <p className="text-slate-400 text-sm mt-1">هذا ما يحدث في مكتبتك اليوم.</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-sm transition-shadow text-right"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${stat.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                        {stat.change}
                      </span>
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent borrowings */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <button
                    onClick={() => setActive("borrowings")}
                    className="text-xs text-amber-500 hover:text-amber-600 font-medium transition-colors"
                  >
                    ← عرض الكل
                  </button>
                  <h3 className="text-sm font-bold text-slate-700">أحدث الاستعارات</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {RECENT_BORROWINGS.map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors flex-row-reverse"
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold shrink-0">
                        {row.user[0]}
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <p className="text-sm font-semibold text-slate-700 truncate">{row.user}</p>
                        <p className="text-xs text-slate-400 truncate">{row.book}</p>
                      </div>
                      <div className="text-left shrink-0 space-y-1">
                        <p className="text-xs text-slate-400">تسليم {row.due}</p>
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${row.status === "متأخر"
                          ? "bg-red-50 text-red-500"
                          : "bg-emerald-50 text-emerald-600"
                          }`}>
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : active === "authors" ? (
            <AuthorsPage />
          ) : active === "books" ? (
            <BooksPage />
          ) : active === "publishers" ? (
            <PublishersPage />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 mb-4">
                {NAV_ITEMS.find(n => n.key === active)?.icon}
              </div>
              <h2 className="text-slate-700 font-bold text-lg">{activeLabel}</h2>
              <p className="text-slate-400 text-sm mt-1">هذا القسم قيد الإنشاء.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}