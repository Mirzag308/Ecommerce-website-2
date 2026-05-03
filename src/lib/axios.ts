// // lib/axios.ts
// import axios from "axios";

// const API_BASE_URL = "http://localhost:8000/api";

// // ✅ Create Axios instance
// const authAxios = axios.create({
//   baseURL: `${API_BASE_URL}/products`,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ Attach Access Token on every request
// authAxios.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken"); // ✅ use correct key
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // ✅ Handle Token Expiry & Refresh Automatically
// authAxios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If token expired & not retried yet
//     if (
//       error.response?.status === 401 &&
//       error.response.data.code === "token_not_valid" &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       const refreshToken = localStorage.getItem("refreshToken");
//       if (refreshToken) {
//         try {
//           const res = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
//             refresh: refreshToken,
//           });

//           const newAccess = res.data.access;
//           localStorage.setItem("accessToken", newAccess);

//           // ✅ Update header & retry request
//           originalRequest.headers.Authorization = `Bearer ${newAccess}`;
//           return authAxios(originalRequest);
//         } catch (refreshError) {
//           console.error("Refresh failed", refreshError);
//           localStorage.removeItem("accessToken");
//           localStorage.removeItem("refreshToken");
//           window.location.href = "/login"; // Redirect to login
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export { authAxios, axios };
import axios from "axios";

// ✅ Environment variable se URL lo, phir /api add karo
const API_BASE_URL = `${import.meta.env.VITE_BASE_URL || "http://localhost:8000"}/api`;

// ✅ Create Axios instance
const authAxios = axios.create({
  baseURL: `${API_BASE_URL}/products`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach Access Token on every request
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle Token Expiry & Refresh Automatically
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response.data.code === "token_not_valid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccess = res.data.access;
          localStorage.setItem("accessToken", newAccess);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return authAxios(originalRequest);
        } catch (refreshError) {
          console.error("Refresh failed", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export { authAxios, axios };