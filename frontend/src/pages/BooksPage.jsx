import { useCallback, useEffect, useMemo, useState } from "react";

const API = "/api/books";

function getToken() {
  return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
}

function authHeaders() {
  const token = getToken();
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function normalizeText(value, fallback = "—") {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
}

function toAuthors(book) {
  if (Array.isArray(book.authors) && book.authors.length > 0) {
    return book.authors
      .map((a) => [a.first_name, a.last_name].filter(Boolean).join(" ").trim() || a.name)
      .filter(Boolean)
      .join("، ");
  }
  return normalizeText(book.author_name);
}

function toPublishers(book) {
  if (Array.isArray(book.publishers) && book.publishers.length > 0) {
    return book.publishers.map((p) => p.name).filter(Boolean).join("، ");
  }
  return normalizeText(book.publisher_name);
}

function toMainCategory(book) {
  if (book.main_category?.name) return book.main_category.name;
  if (book.sub_category?.main_category?.name) return book.sub_category.main_category.name;
  return normalizeText(book.main_category_name);
}

function toSubCategory(book) {
  if (book.sub_category?.name) return book.sub_category.name;
  return normalizeText(book.sub_category_name);
}

function toCopiesCount(book) {
  if (typeof book.copies_count === "number") return book.copies_count;
  if (typeof book.book_copies_count === "number") return book.book_copies_count;
  if (Array.isArray(book.book_copies)) return book.book_copies.length;
  return 0;
}

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API, { headers: authHeaders() });
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data ?? [];
      setBooks(Array.isArray(list) ? list : []);
    } catch {
      setError("تعذّر جلب بيانات الكتب");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const filteredBooks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return books;
    return books.filter((book) =>
      [book.title, book.isbn, toAuthors(book), toPublishers(book)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [books, search]);

  return (
    <div dir="rtl" className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-slate-800 font-bold text-xl">الكتب</h2>
          <p className="text-slate-400 text-sm mt-0.5">عرض الكتب مع المؤلفين والناشرين والتصنيفات</p>
        </div>
      </div>

      <div className="max-w-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث بعنوان الكتاب أو ISBN أو المؤلف..."
          className="w-full px-4 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder-slate-400 transition-colors"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400 text-sm">جارٍ التحميل...</div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
            <button
              onClick={fetchBooks}
              className="mt-3 px-4 py-2 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-slate-600 font-semibold">لا توجد كتب</p>
            <p className="text-slate-400 text-sm mt-1">{search ? "لا توجد نتائج مطابقة" : "أضف كتباً لعرضها هنا"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">#</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">اسم الكتاب</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">عدد النسخ</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">المؤلف</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">الناشر</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">سنة الطباعة</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">الكاتيجوري</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">السب كاتيجوري</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, idx) => (
                  <tr key={book.id ?? `${book.title}-${idx}`} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{idx + 1}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{normalizeText(book.title)}</td>
                    <td className="px-5 py-3.5 text-slate-700">{toCopiesCount(book)}</td>
                    <td className="px-5 py-3.5 text-slate-700">{toAuthors(book)}</td>
                    <td className="px-5 py-3.5 text-slate-700">{toPublishers(book)}</td>
                    <td className="px-5 py-3.5 text-slate-700">{normalizeText(book.publication_year)}</td>
                    <td className="px-5 py-3.5 text-slate-700">{toMainCategory(book)}</td>
                    <td className="px-5 py-3.5 text-slate-700">{toSubCategory(book)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filteredBooks.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400 text-right">
            إجمالي {filteredBooks.length} كتاب{filteredBooks.length !== books.length && ` (من أصل ${books.length})`}
          </div>
        )}
      </div>
    </div>
  );
}
