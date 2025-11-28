// src/helpers/axiosApi.js
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = `https://find-it-hub-backend.vercel.app`;

/**
 * Create axios instance.
 * validateStatus returns `false` only for 401 so 401 responses go to `catch`.
 * All other statuses (200, 400, 403, 500, ...) will be resolved and handled in `then`.
 */
export const axiosApi = axios.create({
  baseURL: API_URL,
  validateStatus: function (status) {
    // Treat 401 as error so it flows to the response error interceptor.
    // Accept all other statuses.
    return status !== 401;
  },
});

/**
 * Request interceptor:
 * - Always attach Authorization from localStorage (if available).
 * - Ensures header uses "Bearer <token>" format.
 */
axiosApi.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("userToken") || "";
      if (token) {
        // If token already contains "Bearer", keep it; otherwise prefix.
        config.headers = config.headers || {};
        config.headers["Authorization"] = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;
      } else {
        // Ensure header removed if no token
        if (config.headers) delete config.headers["Authorization"];
      }
    } catch (err) {
      // silent
    }

    // allow CORS header in requests if desired (you were adding it in helpers)
    config.headers = {
      ...(config.headers || {}),
      "Access-Control-Allow-Origin": "*",
    };

    return config;
  },
  (err) => Promise.reject(err)
);

/**
 * Response interceptor:
 * - On success: if backend returns a new token (common shapes), update localStorage and default header.
 * - On error: if status is 401 and we have a stored userToken, show message, clear storage and redirect to login/root.
 */
axiosApi.interceptors.response.use(
  (response) => {
    // Try to extract a token from common response shapes
    const newToken =
      response?.data?.data?.token || response?.data?.token || null;

    if (newToken) {
      const bearer = newToken.startsWith("Bearer ")
        ? newToken
        : `Bearer ${newToken}`;

      // store token so future requests will pick it up from localStorage (request interceptor)
      try {
        // store both raw token and bearer for backward compatibility in other code parts
        const raw = bearer.replace(/^Bearer\s+/i, "");
        localStorage.setItem("userToken", bearer);
        localStorage.setItem("userTokenRaw", raw);
      } catch (err) {
        // ignore storage failures
      }
    }

    return response;
  },
  async (error) => {
    // If axios itself couldn't process response (network error), bubble up
    if (!error || !error.response) {
      return Promise.reject(error);
    }

    const { response } = error;

    // If 401: centrally handle (session expiry / not authenticated)
    if (response.status === 401) {
      
      // Clear auth info
      try {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userTokenRaw");
        // optionally remove user info
        // localStorage.removeItem("userInfo");
      } catch (err) {
        // ignore
      }

      // Force full redirect to login/root page
      // Using window.location ensures single place redirect independent of router instance
      window.location.href = "/";
    }

    // Re-throw so calling code can still handle other error cases
    return Promise.reject(error);
  }
);

/**
 * Small helpers that always return response.data (like before).
 * They also ensure Authorization header is present (request interceptor does this).
 */

export async function get(url, config = {}) {
  const resp = await axiosApi.get(url, { ...config });
  return resp.data;
}

export async function post(url, data = {}, config = {}) {
  const resp = await axiosApi.post(url, data, { ...config });
  return resp.data;
}

export async function postWithFile(url, data, config = {}) {
  const headers = {
    "Content-Type": "multipart/form-data",
    ...(config.headers || {}),
  };
  const resp = await axiosApi.post(url, data, { ...config, headers });
  return resp.data;
}

export async function put(url, data = {}, config = {}) {
  const resp = await axiosApi.put(url, data, { ...config });
  return resp.data;
}

export async function patch(url, data = {}, config = {}) {
  const resp = await axiosApi.patch(url, data, { ...config });
  return resp.data;
}

export async function del(url, payload = {}, config = {}) {
  // axios.delete supports `data` in config
  const resp = await axiosApi.delete(url, { data: payload, ...config });
  return resp.data;
}
