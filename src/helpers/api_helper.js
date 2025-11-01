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
    // const newToken = response.data && response.data.data.token
    // if (newToken) {
    //   latestToken = newToken
    //   axiosApi.defaults.headers.common["Authorization"] = latestToken
    // }
    console.log("token" ,response.data)
    const newToken = response?.data?.data?.token || response?.data?.token;
if (newToken) {
  latestToken = `Bearer ${newToken}`;
  axiosApi.defaults.headers.common["Authorization"] = latestToken;
}

    return response
  },
  async error => {
    console.log(error)
    if (
      error.response &&
      error.response.status === 401 &&
      localStorage.getItem("userToken")
    ) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Your Session has Timed Out.",
      }).then(() => {
        // localStorage.removeItem("userToken")
        // window.location.href = "/"
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
  console.log("TOKENNN",latestToken)
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

export async function patch(url, data, config = {Authorization: latestToken}) {
  return axiosApi
    .patch(url, data, {
      ...config,
      headers: {
        Authorization: latestToken,
        "Content-Type": "application/json",
        ...config.headers,
      },
    })
    .then(response => response.data)
    .catch(error => {
      console.error("PATCH error:", error);
      throw error;
    });
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