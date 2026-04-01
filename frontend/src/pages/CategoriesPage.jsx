import { useState } from "react";

const CAT_STATS = [
  { label: "إجمالي التصنيفات",         value: "12",    change: "+2",    up: true  },
  { label: "إجمالي التصنيفات الفرعية", value: "48",    change: "+5",    up: true  },
  { label: "الكتب المصنفة",            value: "11,240", change: "+3.1%", up: true  },
  { label: "كتب بدون تصنيف",           value: "1,240",  change: "-8%",   up: false },
];

const INITIAL_CATEGORIES = [
  {
    id: 1, name: "علوم الحاسب", books: 2340, icon: "💻",
    subcategories: [
      { id: 101, name: "البرمجة",              books: 980  },
      { id: 102, name: "الذكاء الاصطناعي",    books: 540  },
      { id: 103, name: "قواعد البيانات",       books: 430  },
      { id: 104, name: "أمن المعلومات",        books: 390  },
    ],
  },
  {
    id: 2, name: "الأدب والروايات", books: 1890, icon: "📖",
    subcategories: [
      { id: 201, name: "الرواية العربية",      books: 720  },
      { id: 202, name: "الأدب العالمي",        books: 610  },
      { id: 203, name: "الشعر",                books: 360  },
      { id: 204, name: "القصة القصيرة",        books: 200  },
    ],
  },
  {
    id: 3, name: "العلوم والطبيعة", books: 1540, icon: "🔬",
    subcategories: [
      { id: 301, name: "الفيزياء",             books: 480  },
      { id: 302, name: "الكيمياء",             books: 390  },
      { id: 303, name: "الأحياء",              books: 420  },
      { id: 304, name: "علم الفلك",            books: 250  },
    ],
  },
  {
    id: 4, name: "التاريخ والجغرافيا", books: 1210, icon: "🌍",
    subcategories: [
      { id: 401, name: "التاريخ الإسلامي",     books: 520  },
      { id: 402, name: "التاريخ العالمي",      books: 410  },
      { id: 403, name: "الجغرافيا البشرية",    books: 280  },
    ],
  },
  {
    id: 5, name: "الإدارة والأعمال", books: 980, icon: "📊",
    subcategories: [
      { id: 501, name: "إدارة المشاريع",       books: 320  },
      { id: 502, name: "التسويق",              books: 290  },
      { id: 503, name: "المحاسبة والمالية",    books: 370  },
    ],
  },
  {
    id: 6, name: "الصحة والطب", books: 870, icon: "🏥",
    subcategories: [
      { id: 601, name: "الطب العام",           books: 340  },
      { id: 602, name: "التغذية",              books: 280  },
      { id: 603, name: "الصحة النفسية",        books: 250  },
    ],
  },
  {
    id: 7, name: "الفلسفة والدين", books: 760, icon: "📿",
    subcategories: [
      { id: 701, name: "الفقه الإسلامي",       books: 360  },
      { id: 702, name: "الفلسفة الغربية",      books: 240  },
      { id: 703, name: "علم الكلام",           books: 160  },
    ],
  },
  {
    id: 8, name: "التربية والتعليم", books: 660, icon: "🎓",
    subcategories: [
      { id: 801, name: "مناهج التدريس",        books: 290  },
      { id: 802, name: "علم النفس التربوي",    books: 230  },
      { id: 803, name: "تعليم اللغات",         books: 140  },
    ],
  },
];

export default function CategoriesPage() {
  const [categories,   setCategories]   = useState(INITIAL_CATEGORIES);
  const [expanded,     setExpanded]     = useState([]);
  const [search,       setSearch]       = useState("");
  const [showModal,    setShowModal]    = useState(false);
  const [modalType,    setModalType]    = useState("category"); // "category" | "subcategory"
  const [editId,       setEditId]       = useState(null);
  const [parentId,     setParentId]     = useState(null);
  const [form,         setForm]         = useState({ name: "", books: "", icon: "📚" });

  const filtered = categories.filter(c =>
    c.name.includes(search) ||
    c.subcategories.some(s => s.name.includes(search))
  );

  const toggleExpand = (id) =>
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // ── Open modals ──
  const openAddCategory = () => {
    setModalType("category"); setEditId(null); setParentId(null);
    setForm({ name: "", books: "", icon: "📚" });
    setShowModal(true);
  };

  const openEditCategory = (cat) => {
    setModalType("category"); setEditId(cat.id); setParentId(null);
    setForm({ name: cat.name, books: String(cat.books), icon: cat.icon });
    setShowModal(true);
  };

  const openAddSub = (catId) => {
    setModalType("subcategory"); setEditId(null); setParentId(catId);
    setForm({ name: "", books: "" });
    setShowModal(true);
  };

  const openEditSub = (sub, catId) => {
    setModalType("subcategory"); setEditId(sub.id); setParentId(catId);
    setForm({ name: sub.name, books: String(sub.books) });
    setShowModal(true);
  };

  // ── Save ──
  const handleSave = () => {
    if (!form.name) return;
    if (modalType === "category") {
      if (editId) {
        setCategories(prev => prev.map(c => c.id === editId ? { ...c, name: form.name, books: Number(form.books) || c.books, icon: form.icon } : c));
      } else {
        setCategories(prev => [...prev, { id: Date.now(), name: form.name, books: Number(form.books) || 0, icon: form.icon || "📚", subcategories: [] }]);
      }
    } else {
      if (editId) {
        setCategories(prev => prev.map(c => c.id === parentId
          ? { ...c, subcategories: c.subcategories.map(s => s.id === editId ? { ...s, name: form.name, books: Number(form.books) || s.books } : s) }
          : c
        ));
      } else {
        setCategories(prev => prev.map(c => c.id === parentId
          ? { ...c, subcategories: [...c.subcategories, { id: Date.now(), name: form.name, books: Number(form.books) || 0 }] }
          : c
        ));
        setExpanded(prev => [...new Set([...prev, parentId])]);
      }
    }
    setShowModal(false);
  };

  // ── Delete ──
  const deleteCategory = (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التصنيف وجميع تصنيفاته الفرعية؟")) return;
    setCategories(prev => prev.filter(c => c.id !== id));
    setExpanded(prev => prev.filter(x => x !== id));
  };

  const deleteSubcategory = (subId, catId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التصنيف الفرعي؟")) return;
    setCategories(prev => prev.map(c => c.id === catId
      ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subId) }
      : c
    ));
  };

  const ICONS = ["📚","💻","📖","🔬","🌍","📊","🏥","📿","🎓","🎨","⚗️","🏛️"];

  return (
    <div className="space-y-5" dir="rtl" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {CAT_STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-sm transition-shadow text-right">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${stat.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                {stat.change}
              </span>
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
                {stat.up ? "🗂️" : "📋"}
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-700 whitespace-nowrap">إدارة التصنيفات</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto flex-row-reverse">
            <button
              onClick={openAddCategory}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              إضافة تصنيف
            </button>
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 flex-1 sm:flex-none sm:w-56">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-slate-400 shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="بحث عن تصنيف..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none w-full text-right" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-right">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 w-8"></th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500">#</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">اسم التصنيف</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">التصنيفات الفرعية</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">عدد الكتب</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm">لا توجد نتائج</td></tr>
              ) : filtered.map((cat, i) => {
                const isOpen = expanded.includes(cat.id);
                return (
                  <>
                    {/* Main category row */}
                    <tr key={cat.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      {/* Expand toggle */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => toggleExpand(cat.id)}
                          className={`w-6 h-6 flex items-center justify-center rounded-md transition-all ${isOpen ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`w-3 h-3 transition-transform ${isOpen ? "rotate-90" : ""}`}>
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">{i + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5 flex-row-reverse justify-end">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-lg shrink-0">
                            {cat.icon}
                          </div>
                          <span className="font-bold text-slate-700">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 flex-wrap">
                          {cat.subcategories.slice(0, 3).map(s => (
                            <span key={s.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap">{s.name}</span>
                          ))}
                          {cat.subcategories.length > 3 && (
                            <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">+{cat.subcategories.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-700 text-sm">{cat.books.toLocaleString("ar-SA")}</span>
                        <span className="text-slate-400 text-xs mr-1">كتاب</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 justify-end">
                          <button onClick={() => openAddSub(cat.id)} className="flex items-center gap-1 p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-xs" title="إضافة تصنيف فرعي">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                          </button>
                          <button onClick={() => openEditCategory(cat)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="تعديل">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button onClick={() => deleteCategory(cat.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Subcategories expanded rows */}
                    {isOpen && cat.subcategories.map((sub, si) => (
                      <tr key={sub.id} className="bg-slate-50/80 border-b border-slate-100 hover:bg-slate-100/60 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex justify-center">
                            <div className="w-px h-5 bg-slate-300 mx-auto"></div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-300 text-xs">{i + 1}.{si + 1}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5 flex-row-reverse justify-end pr-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                              </svg>
                            </div>
                            <span className="text-sm text-slate-600 font-medium">{sub.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-slate-400">تصنيف فرعي</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-sm text-slate-600 font-medium">{sub.books.toLocaleString("ar-SA")}</span>
                          <span className="text-slate-400 text-xs mr-1">كتاب</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5 justify-end">
                            <button onClick={() => openEditSub(sub, cat.id)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors" title="تعديل">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            <button onClick={() => deleteSubcategory(sub.id, cat.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="حذف">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {filtered.length} تصنيف رئيسي ·{" "}
            {filtered.reduce((acc, c) => acc + c.subcategories.length, 0)} تصنيف فرعي
          </span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-md transition-colors">السابق</button>
            <button className="px-2.5 py-1 text-xs bg-slate-900 text-white rounded-md">1</button>
            <button className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-md transition-colors">التالي</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <h2 className="text-sm font-bold text-slate-700">
                {editId
                  ? (modalType === "category" ? "تعديل التصنيف" : "تعديل التصنيف الفرعي")
                  : (modalType === "category" ? "إضافة تصنيف جديد" : "إضافة تصنيف فرعي")}
              </h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 text-right">الاسم</label>
                <input
                  type="text"
                  placeholder={modalType === "category" ? "مثال: علوم الحاسب" : "مثال: البرمجة"}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-lg text-right placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent hover:border-slate-300 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 text-right">عدد الكتب</label>
                <input
                  type="number"
                  placeholder="مثال: 500"
                  value={form.books}
                  onChange={e => setForm(f => ({ ...f, books: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-lg text-right placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent hover:border-slate-300 transition-colors"
                />
              </div>
              {modalType === "category" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 text-right">الأيقونة</label>
                  <div className="grid grid-cols-6 gap-2">
                    {ICONS.map(ic => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, icon: ic }))}
                        className={`w-full aspect-square rounded-lg text-xl flex items-center justify-center transition-all ${form.icon === ic ? "bg-slate-900 ring-2 ring-slate-900 ring-offset-1" : "bg-slate-100 hover:bg-slate-200"}`}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">إلغاء</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-slate-900 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors">
                {editId ? "حفظ التعديلات" : "إضافة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}