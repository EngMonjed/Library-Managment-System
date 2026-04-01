import { useState } from "react";

const API_BASE_URL = "/api";

export default function LoginPage({ onLogin }) {
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]   = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          setError(Array.isArray(firstError) ? firstError[0] : firstError);
        } else {
          setError(data.message || "بيانات الدخول غير صحيحة. حاول مرة أخرى.");
        }
        return;
      }

      const token = data.token || data.access_token;
      if (!token) {
        setError("تم تسجيل الدخول لكن لم يتم استلام رمز التوثيق (token).");
        return;
      }

      if (rememberMe) {
        localStorage.setItem("auth_token", token);
      } else {
        sessionStorage.setItem("auth_token", token);
      }

      onLogin();
    } catch (err) {
      setError("تعذّر الاتصال بالخادم. يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 flex items-center justify-center px-4"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >

      <div className="relative w-full max-w-lg">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Top accent */}
          <div className="h-1 w-full bg-gradient-to-l from-slate-700 via-slate-500 to-slate-400" />

          <div className="px-8 py-10">
            {/* Brand */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              {/* <h1 className="text-xl font-bold text-slate-900">مرحباً بعودتك</h1>
              <p className="text-sm text-slate-500 mt-1">سجّل دخولك للمتابعة</p> */}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 flex-row-reverse text-right">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5 text-right">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg
                    placeholder-slate-400 text-right
                    focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent
                    hover:border-slate-400 transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  {/* <a href="/forgot-password" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">
                    نسيت كلمة المرور؟
                  </a> */}
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    كلمة المرور
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pl-10 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg
                      placeholder-slate-400 text-right
                      focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent
                      hover:border-slate-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5 flex-row-reverse">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-slate-900 cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none">
                  تذكّرني
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700
                  text-white text-sm font-medium py-2.5 rounded-lg transition-colors
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    جارٍ تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          {/* <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              <a href="/register" className="text-slate-800 font-medium hover:underline">
                إنشاء حساب جديد
              </a>
              {" "}ليس لديك حساب؟
            </p>
          </div> */}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6"><br></br>
        © {new Date().getFullYear()}                   جميع الحقوق محفوظة  </p>
        <p className="text-center text-xs text-slate-400 mt-6">Ver 0.0.1</p>
      </div>
    </div>
  );
}