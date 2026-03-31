import { useState, useEffect, useCallback } from "react";

const API = "/api/authors";

function getToken() {
  return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/* ── Icons ── */
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconSpinner = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* ── Empty form state ── */
const emptyForm = { name: "", bio: "", birth_year: "", death_year: "" };

/* ══════════════════════════════════════════════ */
export default function AuthorsPage() {
  const [authors, setAuthors]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add mode
  const [form, setForm]             = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]     = useState(false);
  const [toast, setToast]           = useState(null); // { type, msg }

  /* ── Fetch ── */
  const fetchAuthors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API, { headers: authHeaders() });
      const data = await res.json();
      setAuthors(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      showToast("error", "تعذّر جلب بيانات المؤلفين");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAuthors(); }, [fetchAuthors]);

  /* ── Toast helper ── */
  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  /* ── Filtered list ── */
  const filtered = authors.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Open modal ── */
  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  }
  function openEdit(author) {
    setEditTarget(author);
    setForm({
      name:       author.name       ?? "",
      bio:        author.bio        ?? "",
      birth_year: author.birth_year ?? "",
      death_year: author.death_year ?? "",
    });
    setFormErrors({});
    setModalOpen(true);
  }
  function closeModal() { setModalOpen(false); }

  /* ── Save (create / update) ── */
  async function handleSave(e) {
    e.preventDefault();
    setFormErrors({});
    setSaving(true);
    try {
      const isEdit = !!editTarget;
      const url    = isEdit ? `${API}/${editTarget.id}` : API;
      const method = isEdit ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) });
      const data   = await res.json();

      if (!res.ok) {
        if (data.errors) setFormErrors(data.errors);
        else showToast("error", data.message || "حدث خطأ ما");
        return;
      }

      showToast("success", isEdit ? "تم تحديث المؤلف بنجاح" : "تم إضافة المؤلف بنجاح");
      closeModal();
      fetchAuthors();
    } catch {
      showToast("error", "تعذّر الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  }

  /* ── Delete ── */
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/${deleteTarget.id}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) { showToast("error", "فشل حذف المؤلف"); return; }
      showToast("success", "تم حذف المؤلف بنجاح");
      setDeleteTarget(null);
      fetchAuthors();
    } catch {
      showToast("error", "تعذّر الاتصال بالخادم");
    } finally {
      setDeleting(false);
    }
  }

  /* ── Render ── */
  return (
    <div dir="rtl" className="space-y-5">

      {/* ─ Toast ─ */}
      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          toast.type === "success"
            ? "bg-emerald-600 text-white"
            : "bg-red-600 text-white"
        }`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* ─ Header ─ */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-slate-800 font-bold text-xl">المؤلفون</h2>
          <p className="text-slate-400 text-sm mt-0.5">إدارة سجلات المؤلفين في المنظومة</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <IconPlus />
          إضافة مؤلف
        </button>
      </div>

      {/* ─ Search ─ */}
      <div className="relative max-w-sm">
        <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 pointer-events-none">
          <IconSearch />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث باسم المؤلف..."
          className="w-full pr-9 pl-4 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder-slate-400 transition-colors"
        />
      </div>

      {/* ─ Table card ─ */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <IconSpinner />
            <span className="mr-2 text-sm">جارٍ التحميل...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <IconUser />
            </div>
            <p className="text-slate-600 font-semibold">لا يوجد مؤلفون</p>
            <p className="text-slate-400 text-sm mt-1">
              {search ? "لا توجد نتائج لبحثك" : "ابدأ بإضافة أول مؤلف"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">#</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">الاسم</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">الكتب المرتبطة</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">سنة الميلاد</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">سنة الوفاة</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((author, idx) => (
                  <tr key={author.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{idx + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 flex-row-reverse justify-end">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {author.name?.[0] ?? "؟"}
                        </div>
                        <span className="font-semibold text-slate-800">{author.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {author.books_count > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
                          {author.books_count} كتاب
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">لا يوجد</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 hidden lg:table-cell">{author.birth_year || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-600 hidden lg:table-cell">{author.death_year || "—"}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(author)}
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <IconEdit />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(author)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400 text-right">
            إجمالي {filtered.length} مؤلف{filtered.length !== authors.length && ` (من أصل ${authors.length})`}
          </div>
        )}
      </div>

      {/* ════════ Add / Edit Modal ════════ */}
      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" dir="rtl">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />

          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Top accent */}
            <div className="h-1 bg-gradient-to-l from-slate-700 via-slate-500 to-amber-400" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 transition-colors p-1">
                <IconX />
              </button>
              <div className="text-right">
                <h3 className="text-slate-800 font-bold text-base">
                  {editTarget ? "تعديل بيانات المؤلف" : "إضافة مؤلف جديد"}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  {editTarget ? `تعديل: ${editTarget.name}` : "أدخل بيانات المؤلف الجديد"}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 text-right">
                  الاسم <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="اسم المؤلف"
                  className={`w-full px-3.5 py-2.5 text-sm text-right bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors placeholder-slate-400 ${
                    formErrors.name ? "border-red-400" : "border-slate-300 hover:border-slate-400"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1 text-right">{formErrors.name[0]}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 text-right">نبذة تعريفية</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="نبذة مختصرة عن المؤلف..."
                  className="w-full px-3.5 py-2.5 text-sm text-right bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent hover:border-slate-400 transition-colors placeholder-slate-400 resize-none"
                />
              </div>

              {/* Birth / Death year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 text-right">سنة الميلاد</label>
                  <input
                    type="text"
                    value={form.birth_year}
                    onChange={(e) => setForm({ ...form, birth_year: e.target.value })}
                    placeholder="مثال: 1950"
                    className="w-full px-3.5 py-2.5 text-sm text-right bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent hover:border-slate-400 transition-colors placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 text-right">سنة الوفاة</label>
                  <input
                    type="text"
                    value={form.death_year}
                    onChange={(e) => setForm({ ...form, death_year: e.target.value })}
                    placeholder="مثال: 2010"
                    className="w-full px-3.5 py-2.5 text-sm text-right bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent hover:border-slate-400 transition-colors placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? <><IconSpinner /> جارٍ الحفظ...</> : (editTarget ? "حفظ التعديلات" : "إضافة المؤلف")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════ Delete Confirm Modal ════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-right">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 mb-4 mx-auto">
              <IconTrash />
            </div>
            <h3 className="text-slate-800 font-bold text-base text-center mb-1">تأكيد الحذف</h3>
            <p className="text-slate-500 text-sm text-center mb-5">
              هل أنت متأكد من حذف <strong className="text-slate-800">{deleteTarget.name}</strong>؟
              <br />لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {deleting ? <><IconSpinner /> جارٍ الحذف...</> : "نعم، احذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
