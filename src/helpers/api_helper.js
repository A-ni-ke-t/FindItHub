import axios from "axios"
import accessToken from "./jwt-token-access/accessToken"
import Swal from "sweetalert2"

const token = accessToken

const API_URL = ""

const axiosApi = axios.create({
  baseURL: API_URL,
})

let latestToken = accessToken

axiosApi.defaults.headers.common["Authorization"] = latestToken

axiosApi.interceptors.response.use(
  response => {
    const newToken = response.data && response.data.data.token
    if (newToken) {
      latestToken = newToken
      axiosApi.defaults.headers.common["Authorization"] = latestToken
    }

    return response
  },
  async error => {
    console.log(error)
    if (
      error.response &&
      error.response.status === 401 &&
      localStorage.getItem("authUser")
    ) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Your Session has Timed Out.",
      }).then(() => {
        localStorage.removeItem("authUser")
        window.location.href = "/login"
      })
    }
    return Promise.reject(error)
  }
)

export async function get(url, config = {}) {
  return await axiosApi
    .get(url, {
      ...config,
      headers: {
        Authorization: latestToken,
        "Access-Control-Allow-Origin": "*",
      },
    })
    .then(response => response.data)
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, data, { ...config, headers: { Authorization: latestToken } })
    .then(response => response.data)
}

export async function postWithFile(
  url,
  data,
  config = { Authorization: latestToken }
) {
  const headers = {
    ...config,
    "Content-Type": "multipart/form-data",
  }

  return axiosApi.post(url, data, { headers }).then(response => response.data)
}

export async function put(url, data, config = { Authorization: accessToken }) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

// export async function del(url, config = { Authorization: latestToken }) {
//   return await axiosApi
//     .delete(url, { ...config })
//     .then(response => response.data)
// }

export async function del(url, payload, config = { Authorization: latestToken }) {
  return await axios.delete(url, { 
    data: payload,
    headers: { ...config }
  }).then(response => response.data);
}