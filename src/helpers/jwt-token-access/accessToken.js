// src/helpers/accessToken.js

let accessToken = null;

const token = localStorage.getItem("userToken");

if (token) {
  accessToken = `Bearer ${token}`;
} else {
  console.warn("⚠️ No access token found in localStorage.");
}

export default accessToken;
