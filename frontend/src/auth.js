export const getToken = () =>
  localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

export const isLoggedIn = () => !!getToken();

export const logout = async () => {
  const token = getToken();
  if (token) {
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  }
  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_token");
  window.location.href = "/";
};

export const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
  Accept: "application/json",
});