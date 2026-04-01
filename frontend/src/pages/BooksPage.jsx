import { useCallback, useEffect, useMemo, useState } from "react";

const API = "/api/books";

function getToken() {
  return (
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );
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
      .map(
        (a) =>
          [a.first_name, a.last_name].filter(Boolean).join(" ").trim() ||
          a.name ||
          a.full_name,
      )
      .filter(Boolean)
      .join("، ");
  }
  return normalizeText(book.author_name);
}

function toPublishers(book) {
  if (book.publisher?.name) return book.publisher.name;
  if (Array.isArray(book.publishers) && book.publishers.length > 0) {
    return book.publishers
      .map((p) => p.name)
      .filter(Boolean)
      .join("، ");
  }
  return normalizeText(book.publisher_name);
}

function toMainCategory(book) {
  if (Array.isArray(book.sub_categories) && book.sub_categories.length > 0) {
    return normalizeText(book.sub_categories[0]?.category?.name);
  }
  if (book.main_category?.name) return book.main_category.name;
  if (book.sub_category?.main_category?.name)
    return book.sub_category.main_category.name;
  return normalizeText(book.main_category_name);
}

function toSubCategory(book) {
  if (Array.isArray(book.sub_categories) && book.sub_categories.length > 0) {
    return book.sub_categories
      .map((s) => s.name)
      .filter(Boolean)
      .join("، ");
  }
  if (book.sub_category?.name) return book.sub_category.name;
  return normalizeText(book.sub_category_name);
}

function toCopiesCount(book) {
  if (typeof book.copies_count === "number") return book.copies_count;
  if (typeof book.book_copies_count === "number") return book.book_copies_count;
  if (Array.isArray(book.book_copies)) return book.book_copies.length;
  if (typeof book.copies === "number") return book.copies;
  return 0;
}

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!getToken()) {
        setError("لا يوجد توكن دخول محفوظ. سجّل خروج ثم دخول مجددًا.");
        setBooks([]);
        return;
      }

      const res = await fetch(API, { headers: authHeaders() });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          setError("غير مصرح: الرجاء تسجيل الدخول مرة أخرى.");
          setBooks([]);
          return;
        }
        if (res.status === 403) {
          setError("لا تملك صلاحية عرض الكتب (manage_books).");
          setBooks([]);
          return;
        }
        setError(data.message || "فشل جلب بيانات الكتب من الخادم");
        setBooks([]);
        return;
      }
      const list = Array.isArray(data) ? data : (data.data ?? []);
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
    let result = books;

    // search
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter((book) =>
        [book.title, book.isbn, toAuthors(book), toPublishers(book)]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    // filter
    if (filter) {
      result = result.filter((book) => {
        const copies = book.book_copies || [];

        if (filter === "available") {
          return copies.some((c) => c.status === "available");
        }

        if (filter === "borrowed") {
          return copies.some((c) => c.status === "borrowed");
        }

        return true;
      });
    }
    return result;
  }, [books, search, filter]);

  const BOOK_STATS = useMemo(() => {
    const totalBooks = books.length;

    let totalCopies = 0;
    let available = 0;
    let borrowed = 0;

    books.forEach((book) => {
      const copies = book.book_copies || [];

      totalCopies += toCopiesCount(book);

      copies.forEach((copy) => {
        if (copy.status === "available") available++;
        if (copy.status === "borrowed") borrowed++;
      });
    });

    return [
      {
        label: "إجمالي الكتب",
        value: totalBooks,
        change: "",
        up: true,
      },
      {
        label: "إجمالي النسخ",
        value: totalCopies,
        change: "",
        up: true,
      },
      {
        label: "النسخ المتاحة",
        value: available,
        change: "",
        up: true,
      },
      {
        label: "النسخ المستعارة",
        value: borrowed,
        change: "",
        up: false,
      },
    ];
  }, [books]);

  return (
    <div dir="rtl" className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {BOOK_STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-sm transition-shadow text-right"
          >
            <div className="flex items-start justify-between mb-3">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                  stat.up
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {stat.change || ""}
              </span>

              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
                📚
              </div>
            </div>

            <p className="text-2xl font-bold text-slate-800">
              {stat.value.toLocaleString("en-TR")}
            </p>

            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Title */}
          <h3 className="text-sm font-bold text-slate-700 whitespace-nowrap">
            إدارة الكتب
          </h3>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-row-reverse">
            {/* Add Book Button */}
            <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-3.5 h-3.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              إضافة كتاب
            </button>
            {/* Filter Combobox */}
            <select
              className="text-xs bg-slate-100 text-slate-700 px-3 py-2 rounded-lg focus:outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">كل الكتب</option>
              <option value="available">متاحة</option>
              <option value="borrowed">مستعارة</option>
            </select>
            {/* Search */}
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-full sm:w-56">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-3.5 h-3.5 text-slate-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="بحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none w-full text-right"
              />
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400 text-sm">
            جارٍ التحميل...
          </div>
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
            <p className="text-slate-400 text-sm mt-1">
              {search ? "لا توجد نتائج مطابقة" : "أضف كتباً لعرضها هنا"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    #
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    اسم الكتاب
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    عدد النسخ
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    المؤلف
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    الناشر
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    سنة الطباعة
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    الفئة
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    الفئة الفرعية
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, idx) => (
                  <tr
                    key={book.id ?? `${book.title}-${idx}`}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-100"
                  >
                    <td className="px-5 py-3.5 text-slate-400 text-xs">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      {normalizeText(book.title)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {toCopiesCount(book)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {toAuthors(book)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {toPublishers(book)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {normalizeText(book.publication_year)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {toMainCategory(book)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {toSubCategory(book)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && filteredBooks.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400 text-right">
            إجمالي {filteredBooks.length} كتاب
            {filteredBooks.length !== books.length &&
              ` (من أصل ${books.length})`}
          </div>
        )}
      </div>
    </div>
  );
}
