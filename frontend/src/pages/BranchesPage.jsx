import { useState } from "react";

const BRANCH_STATS = [
  { label: "إجمالي الفروع",      value: "8",     change: "0%",    up: true  },
  { label: "الكتب الموزعة",      value: "12,480", change: "+3.2%", up: true  },
  { label: "الاستعارات النشطة",  value: "1,093",  change: "+8.1%", up: true  },
  { label: "التسليمات المتأخرة", value: "47",     change: "-12%",  up: false },
];

const BRANCHES = [
  { id: 1, name: "الفرع الرئيسي",      city: "مارع",  manager: "أحمد الحربي",   books: 3200, active_borrowings: 312, status: "نشط"    },
  { id: 2, name: "فرع الملز",           city: "عفرين",  manager: "سارة العمري",   books: 1800, active_borrowings: 198, status: "نشط"    },
  { id: 3, name: "فرع العليا",          city: "جرابلس",  manager: "خالد الشمري",   books: 2100, active_borrowings: 245, status: "نشط"    },
  { id: 4, name: "فرع طريق الملك",      city: "الباب",     manager: "منى القرشي",    books: 1500, active_borrowings: 133, status: "نشط"    },
  { id: 5, name: "فرع حي النزهة",       city: "سلقين",     manager: "عمر باسلامة",   books: 980,  active_borrowings:  87, status: "صيانة"  },
  { id: 6, name: "فرع الحمدانية",       city: "جنديرس",     manager: "ريم الزهراني",  books: 1200, active_borrowings: 102, status: "نشط"    },
  { id: 7, name: "فرع العزيزية",        city: "الأتارب",     manager: "يوسف الغامدي",  books: 870,  active_borrowings:  63, status: "نشط"    },
  { id: 8, name: "فرع المطار",          city: "الدانا",  manager: "لينا الدوسري",  books: 830,  active_borrowings:  53, status: "مغلق"   },
];

const STATUS_STYLE = {
  "نشط":    "bg-emerald-50 text-emerald-600",
  "صيانة":  "bg-amber-50   text-amber-600",
  "مغلق":   "bg-red-50     text-red-500",
};

const CITIES = ["الكل", ...Array.from(new Set(BRANCHES.map(b => b.city)))];

export default function BranchesPage() {
  const [search,     setSearch]     = useState("");
  const [cityFilter, setCityFilter] = useState("الكل");
  const [showModal,  setShowModal]  = useState(false);
  const [branches,   setBranches]   = useState(BRANCHES);
  const [editBranch, setEditBranch] = useState(null);
  const [form,       setForm]       = useState({ name: "", city: "", manager: "", books: "", status: "نشط" });

  const filtered = branches.filter(b => {
    const matchSearch = b.name.includes(search) || b.manager.includes(search) || b.city.includes(search);
    const matchCity   = cityFilter === "الكل" || b.city === cityFilter;
    return matchSearch && matchCity;
  });

  const openAdd = () => {
    setEditBranch(null);
    setForm({ name: "", city: "", manager: "", books: "", status: "نشط" });
    setShowModal(true);
  };

  const openEdit = (branch) => {
    setEditBranch(branch.id);
    setForm({ name: branch.name, city: branch.city, manager: branch.manager, books: branch.books, status: branch.status });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.city || !form.manager) return;
    if (editBranch) {
      setBranches(prev => prev.map(b => b.id === editBranch ? { ...b, ...form, books: Number(form.books) } : b));
    } else {
      setBranches(prev => [...prev, { id: Date.now(), active_borrowings: 0, ...form, books: Number(form.books) || 0 }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الفرع؟")) {
      setBranches(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-5" dir="rtl" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {BRANCH_STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-sm transition-shadow text-right">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${stat.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                {stat.change}
              </span>
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

        {/* Table header: title + filters + add button */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-700 whitespace-nowrap">إدارة الفروع</h3>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-row-reverse">
            {/* Add button */}
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              إضافة فرع
            </button>

            {/* City filter */}
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
            >
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>

            {/* Search */}
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 flex-1 sm:flex-none sm:w-52">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-slate-400 shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="بحث عن فرع..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none w-full text-right"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-right">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">#</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">اسم الفرع</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">المدينة</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">المدير</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">الكتب</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">الاستعارات</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">الحالة</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-400 text-sm">
                    لا توجد نتائج مطابقة للبحث
                  </td>
                </tr>
              ) : filtered.map((branch, i) => (
                <tr key={branch.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5 flex-row-reverse justify-end">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-amber-400 shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </div>
                      <span className="font-semibold text-slate-700 whitespace-nowrap">{branch.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">{branch.city}</td>
                  <td className="px-5 py-3.5 text-slate-600 text-xs whitespace-nowrap">{branch.manager}</td>
                  <td className="px-5 py-3.5 text-slate-700 font-medium text-xs">{branch.books.toLocaleString("ar-SA")}</td>
                  <td className="px-5 py-3.5 text-slate-700 font-medium text-xs">{branch.active_borrowings}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[branch.status]}`}>
                      {branch.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(branch)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(branch.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            عرض {filtered.length} من {branches.length} فرع
          </span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-md transition-colors">السابق</button>
            <button className="px-2.5 py-1 text-xs bg-slate-900 text-white rounded-md">1</button>
            <button className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-md transition-colors">التالي</button>
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <h2 className="text-sm font-bold text-slate-700">
                {editBranch ? "تعديل الفرع" : "إضافة فرع جديد"}
              </h2>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              {[
                { label: "اسم الفرع",  key: "name",    placeholder: "مثال: فرع الملز"      },
                { label: "المدينة",    key: "city",    placeholder: "مثال: الرياض"          },
                { label: "المدير",     key: "manager", placeholder: "مثال: أحمد الحربي"    },
                { label: "عدد الكتب", key: "books",   placeholder: "مثال: 1500", type: "number" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 text-right">{label}</label>
                  <input
                    type={type || "text"}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-lg text-right
                      placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent
                      hover:border-slate-300 transition-colors"
                  />
                </div>
              ))}

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 text-right">الحالة</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-lg text-right
                    focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white cursor-pointer"
                >
                  <option>نشط</option>
                  <option>صيانة</option>
                  <option>مغلق</option>
                </select>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-slate-900 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
              >
                {editBranch ? "حفظ التعديلات" : "إضافة الفرع"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}