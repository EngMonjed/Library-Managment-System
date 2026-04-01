import { Fragment, useState, useEffect, useCallback } from "react";

const API = "/api/publishers";

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
const IconPlus    = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const IconEdit    = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const IconTrash   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>);
const IconSearch  = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>);
const IconX       = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const IconBook    = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>);
const IconChevron = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>);
const IconSpinner = () => (<svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>);

const emptyForm = { name: "" };

export default function PublishersPage() {
  const [publishers, setPublishers]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [modalOpen, setModalOpen]       = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [form, setForm]                 = useState(emptyForm);
  const [formErrors, setFormErrors]     = useState({});
  const [saving, setSaving]             = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [expandedId, setExpandedId]     = useState(null);   // publisher whose books are shown
  const [booksMap, setBooksMap]         = useState({});      // { [publisherId]: Book[] }
  const [booksLoading, setBooksLoading] = useState({});
  const [toast, setToast]               = useState(null);

  /* ── Fetch publishers ── */
  const fetchPublishers = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(API, { headers: authHeaders() });
      const data = await res.json();
      setPublishers(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      showToast("error", "تعذّر جلب بيانات دور النشر");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPublishers(); }, [fetchPublishers]);

  /* ── Fetch books for a publisher ── */
  async function fetchBooks(publisherId) {
    if (booksMap[publisherId]) { setExpandedId(expandedId === publisherId ? null : publisherId); return; }
    setBooksLoading(prev => ({ ...prev, [publisherId]: true }));
    try {
      const res  = await fetch(`/api/books?publisher_id=${publisherId}`, { headers: authHeaders() });
      const data = await res.json();
      const books = Array.isArray(data) ? data : (data.data ?? []);
      // filter by publisher_id client-side in case the API returns all
      const filtered = books.filter(b => b.publisher_id === publisherId);
      setBooksMap(prev => ({ ...prev, [publisherId]: filtered }));
      setExpandedId(publisherId);
    } catch {
      showToast("error", "تعذّر جلب الكتب");
    } finally {
      setBooksLoading(prev => ({ ...prev, [publisherId]: false }));
    }
  }

  function toggleExpand(pub) {
    if (expandedId === pub.id) { setExpandedId(null); return; }
    fetchBooks(pub.id);
  }

  /* ── Toast ── */
  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  const filtered = publishers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Modal helpers ── */
  function openAdd()  { setEditTarget(null); setForm(emptyForm); setFormErrors({}); setModalOpen(true); }
  function openEdit(p) { setEditTarget(p); setForm({ name: p.name ?? "" }); setFormErrors({}); setModalOpen(true); }
  function closeModal() { setModalOpen(false); }

  /* ── Save ── */
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
      showToast("success", isEdit ? "تم تحديث دار النشر" : "تمت إضافة دار النشر");
      closeModal();
      fetchPublishers();
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
      if (!res.ok && res.status !== 204) { showToast("error", "فشل حذف دار النشر"); return; }
      showToast("success", "تم حذف دار النشر بنجاح");
      setDeleteTarget(null);
      setExpandedId(null);
      fetchPublishers();
    } catch {
      showToast("error", "تعذّر الاتصال بالخادم");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div dir="rtl" className="space-y-5">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-slate-800 font-bold text-xl">دور النشر</h2>
          <p className="text-slate-400 text-sm mt-0.5">إدارة دور النشر والكتب المرتبطة بها</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <IconPlus /> إضافة دار نشر
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 pointer-events-none"><IconSearch /></span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="بحث باسم دار النشر..."
          className="w-full pr-9 pl-4 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder-slate-400 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <IconSpinner /><span className="mr-2 text-sm">جارٍ التحميل...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4"><IconBook /></div>
            <p className="text-slate-600 font-semibold">لا توجد دور نشر</p>
            <p className="text-slate-400 text-sm mt-1">{search ? "لا توجد نتائج" : "ابدأ بإضافة أول دار نشر"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">#</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">الاسم</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">الكتب المرتبطة</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">عرض الكتب</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pub, idx) => (
                  <Fragment key={pub.id}>
                    {/* Publisher row */}
                    <tr key={pub.id} className="hover:bg-slate-50 transition-colors group border-b border-slate-100">
                      <td className="px-5 py-3.5 text-slate-400 text-xs">{idx + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3 flex-row-reverse justify-end">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {pub.name?.[0] ?? "؟"}
                          </div>
                          <span className="font-semibold text-slate-800">{pub.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {pub.books_count > 0 ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                            <IconBook />{pub.books_count} كتاب
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">لا يوجد</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {pub.books_count > 0 ? (
                          <button
                            onClick={() => toggleExpand(pub)}
                            className={`flex items-center gap-1.5 text-xs font-medium transition-colors px-3 py-1.5 rounded-lg border ${
                              expandedId === pub.id
                                ? "bg-slate-900 text-white border-slate-900"
                                : "text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
                            }`}
                          >
                            {booksLoading[pub.id] ? <IconSpinner /> : (
                              <span className={`transition-transform ${expandedId === pub.id ? "rotate-90" : ""}`}><IconChevron /></span>
                            )}
                            {expandedId === pub.id ? "إخفاء" : "عرض الكتب"}
                          </button>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(pub)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="تعديل"><IconEdit /></button>
                          <button onClick={() => setDeleteTarget(pub)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف"><IconTrash /></button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded books sub-row */}
                    {expandedId === pub.id && (
                      <tr key={`books-${pub.id}`} className="bg-slate-50/70">
                        <td colSpan={5} className="px-6 py-4">
                          {booksLoading[pub.id] ? (
                            <div className="flex items-center gap-2 text-slate-400 text-sm"><IconSpinner /> جارٍ تحميل الكتب...</div>
                          ) : (booksMap[pub.id] ?? []).length === 0 ? (
                            <p className="text-slate-400 text-sm">لا توجد كتب مرتبطة بهذه الدار.</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {(booksMap[pub.id] ?? []).map(book => (
                                <div key={book.id} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-3 py-2.5 flex-row-reverse">
                                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0"><IconBook /></div>
                                  <div className="text-right min-w-0">
                                    <p className="text-slate-800 text-xs font-semibold truncate">{book.title}</p>
                                    <p className="text-slate-400 text-xs">{book.publication_year ?? "—"}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400 text-right">
            إجمالي {filtered.length} دار نشر{filtered.length !== publishers.length && ` (من أصل ${publishers.length})`}
          </div>
        )}
      </div>

      {/* ════ Add/Edit Modal ════ */}
      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="h-1 bg-gradient-to-l from-slate-700 via-slate-500 to-amber-400" />
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 transition-colors p-1"><IconX /></button>
              <div className="text-right">
                <h3 className="text-slate-800 font-bold text-base">{editTarget ? "تعديل دار النشر" : "إضافة دار نشر جديدة"}</h3>
                <p className="text-slate-400 text-xs mt-0.5">{editTarget ? `تعديل: ${editTarget.name}` : "أدخل اسم دار النشر"}</p>
              </div>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 text-right">الاسم <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="اسم دار النشر"
                  className={`w-full px-3.5 py-2.5 text-sm text-right bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors placeholder-slate-400 ${
                    formErrors.name ? "border-red-400" : "border-slate-300 hover:border-slate-400"
                  }`}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1 text-right">{formErrors.name[0]}</p>}
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">إلغاء</button>
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-60">
                  {saving ? <><IconSpinner /> جارٍ الحفظ...</> : (editTarget ? "حفظ التعديلات" : "إضافة")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════ Delete Confirm ════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 mb-4 mx-auto"><IconTrash /></div>
            <h3 className="text-slate-800 font-bold text-base mb-1">تأكيد الحذف</h3>
            <p className="text-slate-500 text-sm mb-5">
              هل أنت متأكد من حذف <strong className="text-slate-800">{deleteTarget.name}</strong>؟<br />
              سيؤدي ذلك إلى إزالة الدار من المنظومة.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">إلغاء</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-60">
                {deleting ? <><IconSpinner /> جارٍ الحذف...</> : "نعم، احذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
