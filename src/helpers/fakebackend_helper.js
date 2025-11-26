import { del, get, post, postWithFile,patch, put } from "./api_helper"
import * as url from "./url_helper"

export const login = user => post(`${url.LOGIN_USER}`, user)
export const forgotPassword = user => post(`${url.FORGOT_PASSWORD}`, user)
export const resetPassword = user => post(`${url.RESET_PASSWORD}`, user)
export const verifyOtp = (otpData) => post(`${url.VERIFY_OTP}`, otpData);
export const resendOtp = (otpData) => post(`${url.RESEND_OTP}`, otpData);
export const registerUser = (data) => post(`${url.REGISTER_USER}`, data);
export const changePassword = (data) => post(`${url.CHANGE_PASSWORD}`, data);
export const logout = user => post(`${url.LOGOUT_USER}`, user)
export const addItem = data => post(`${url.ADD_ITEMS}`, data)
export const getItems = (data) => get(`${url.GET_ITEMS}?${data}`)
export const getItemComments = (id) => get(`${url.GET_COMMENTS}/${id}/comments`)
export const postItemComment = (id,data) => post(`${url.POST_ITEM}/${id}/comments`, data)
export const markItemAsReturned = (id,data) => patch(`${url.RETURNED_ITEM}/${id}/return`, data)
export const patchItem = (id,data) => patch(`${url.UPDATE_ITEM}/${id}`, data)
export const uploadFile = (formData) => postWithFile(`${url.UPLOAD}`, formData);

export const getUsersList = () => get(url.GET_USERS)
export const getUserDetails = id => get(`${url.GET_USER_DETAIL}/${id}`, id)
export const addNewUser = user => post(`${url.ADD_NEW_USER}`, user)
export const updateUser = (id, user) => put(`${url.UPDATE_USER}/${id}`, user)
export const deleteUser = user =>
  del(`${url.DELETE_USER}/${user}`, { headers: { user } })

export const getProductsList = () => get(url.GET_PRODUCTS)
export const getProductDetails = id =>
  get(`${url.GET_PRODUCT_DETAIL}/${id}`, id)
export const addNewProduct = product => post(`${url.ADD_NEW_PRODUCT}`, product)
export const updateProduct = (id, product) =>
  put(`${url.UPDATE_PRODUCT}/${id}`, product)
export const deleteProduct = product =>
  del(`${url.DELETE_PRODUCT}/${product}`, { headers: { product } })


// export const getCategoryInProduct = () => get(url.GET_CATEGORY_IN_PRODUCT)
// export const getSubcategoryInProduct = id =>
//   get(`${url.GET_SUBCATEGORY_IN_PRODUCT}/${id}`, id)
// export const getSizeInProduct = () => get(url.GET_SIZE_IN_PRODUCT)
// export const getSizeChartInProduct = () => get(url.GET_SIZE_CHART_IN_PRODUCT)
// export const getColorInVariation = () => get(url.GET_COLOR_IN_VARIATION)
// export const getVariationList = id => get(`${url.GET_VARIATION_LIST}/${id}`, id)
// export const deleteVariation = (id, variation) =>
//   del(`${url.DELETE_VARIATION}/${id}`, variation)
// export const addNewVariation = (id, product) =>
//   put(`${url.ADD_NEW_VARIATION}/${id}`, product)
// export const uploadFileVariation = uploadFile =>
//   postWithFile(`${url.UPLOAD_FILE_VARIATION}`, uploadFile)

// export const getSizesList = () => get(url.GET_SIZES)
// export const getSizeDetails = id => get(`${url.GET_SIZE_DETAIL}/${id}`, id)
// export const addNewSize = size => post(`${url.ADD_NEW_SIZE}`, size)
// export const updateSize = (id, size) => put(`${url.UPDATE_SIZE}/${id}`, size)
// export const deleteSize = size =>
//   del(`${url.DELETE_SIZE}/${size}`, { headers: { size } })

// export const getSizeChartList = () => get(url.GET_SIZE_CHART_LIST)
// export const getSizeChartDetail = id =>
//   get(`${url.GET_SIZE_CHART_DETAIL}/${id}`, id)
// export const addNewSizeChart = size => post(`${url.ADD_NEW_SIZE_CHART}`, size)
// export const updateSizeChart = (id, size) =>
//   put(`${url.UPDATE_SIZE_CHART}/${id}`, size)
// export const deleteSizeChart = size =>
//   del(`${url.DELETE_SIZE_CHART}/${size}`, { headers: { size } })
// export const getSizesForSizeChart = () => get(url.GET_SIZES_FOR_SIZE_CHART)
// export const getSizesForSizeChartByTopOrBottom = type =>
//   get(`${url.GET_SIZES_FOR_SIZE_CHART_BY_TOP_OR_BOTTOM}/${type}`)
// export const uploadFileSizechart = uploadFile =>
//   postWithFile(`${url.UPLOAD_FILE_SIZECHART}`, uploadFile)

// export const getColorsList = () => get(url.GET_COLORS)
// export const getColorDetails = id => get(`${url.GET_COLOR_DETAIL}/${id}`, id)
// export const addNewColor = color => post(`${url.ADD_NEW_COLOR}`, color)
// export const updateColor = (id, color) =>
//   put(`${url.UPDATE_COLOR}/${id}`, color)
// export const deleteColor = color =>
//   del(`${url.DELETE_COLOR}/${color}`, { headers: { color } })

// export const uploadFile = uploadFile =>
//   postWithFile(`${url.UPLOAD_FILE_CATEGORY}`, uploadFile)
// export const getCategoriesList = () => get(url.GET_CATEGORIES)
// export const getCategoryDetails = id =>
//   get(`${url.GET_CATEGORY_DETAIL}/${id}`, id)
// export const addNewCategory = category =>
//   post(`${url.ADD_NEW_CATEGORY}`, category)
// export const updateCategory = (id, category) =>
//   put(`${url.UPDATE_CATEGORY}/${id}`, category)
// export const deleteCategory = category =>
//   del(`${url.DELETE_CATEGORY}/${category}`, { headers: { category } })

// export const uploadFileSubcategory = uploadFile =>
//   postWithFile(`${url.UPLOAD_FILE_SUBCATEGORY}`, uploadFile)
// export const getSubCategoriesList = () => get(url.GET_SUBCATEGORIES_LIST)
// export const getSubCategoryDetails = id =>
//   get(`${url.GET_SUBCATEGORY_DETAIL}/${id}`, id)
// export const addNewSubCategory = category =>
//   post(`${url.ADD_NEW_SUBCATEGORY}`, category)
// export const updateSubCategory = (id, category) =>
//   put(`${url.UPDATE_SUBCATEGORY}/${id}`, category)
// export const deleteSubCategory = category =>
//   del(`${url.DELETE_SUBCATEGORY}/${category}`, { headers: { category } })
// export const getCategoriesListForSubCategory = () =>
//   get(url.GET_CATEGORIES_LIST_FOR_SUBCATEGORY)

// export const getNewsletterList = () => get(url.GET_NEWSLETTER_LIST)

// export const getEcomUsersList = id => get(`${url.GET_ECOM_USERS_LIST}/${id}`)

// export const getAllOrdersList = id => get(`${url.GET_ALL_ORDERS}/${id}`)
// export const addTrackingDetail = data => put(`${url.ADD_TRACKING_DETAIL}`, data)
// export const getDeliveredOrdersList = () => get(`${url.GET_DELIVERED_ORDERS}`)

// export const getContactUsList = () => get(`${url.GET_CONTACT_US_LIST}`)

// export const getDashboardData = data => post(`${url.GET_DASHBOARD_DATA}`, data)
