const obj = JSON.parse(localStorage.getItem("authUser"))
let accessToken = null

if (obj && obj.data.token) {
  const Authorization = obj.data.token
  accessToken = Authorization
}

export default accessToken
