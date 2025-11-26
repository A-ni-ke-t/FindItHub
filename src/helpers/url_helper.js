// export const API_URL = process.env.REACT_APP_API_URL
export const API_URL = `https://find-it-hub-backend.vercel.app`
// export const API_URL = `http://localhost:9000`


export const LOGIN_USER = `${API_URL}/auth/login`
export const FORGOT_PASSWORD = `${API_URL}/auth/forgot-password`
export const RESET_PASSWORD = `${API_URL}/auth/reset-password`
export const VERIFY_OTP = `${API_URL}/auth/verify-otp`;
export const RESEND_OTP = `${API_URL}/auth/resend-otp`;
export const REGISTER_USER = `${API_URL}/auth/register`;
export const CHANGE_PASSWORD = `${API_URL}/auth/change-password`;
export const ADD_ITEMS = `${API_URL}/items`;
export const GET_ITEMS = `${API_URL}/items`;
export const GET_COMMENTS = `${API_URL}/items`;
export const POST_ITEM = `${API_URL}/items`;
export const RETURNED_ITEM = `${API_URL}/items`;
export const UPDATE_ITEM = `${API_URL}/items`;
export const UPLOAD = `${API_URL}/upload/`;

export const LOGOUT_USER = `${API_URL}/auth/logout`

export const GET_PRODUCTS = `${API_URL}/api/products/list-products`
export const GET_PRODUCT_DETAIL = `${API_URL}/api/products/get-product`
export const ADD_NEW_PRODUCT = `${API_URL}/api/products/add-new-product`
export const UPDATE_PRODUCT = `${API_URL}/api/products/update-product`
export const DELETE_PRODUCT = `${API_URL}/api/products/delete-product`
export const GET_CATEGORY_IN_PRODUCT = `${API_URL}/api/category/list-category`
export const GET_SUBCATEGORY_IN_PRODUCT = `${API_URL}/api/products/get-subcategories-in-product`
export const GET_SIZE_IN_PRODUCT = `${API_URL}/api/size/list-size-list`
export const GET_SIZE_CHART_IN_PRODUCT = `${API_URL}/api/sizechart/list-size-chart-list`
export const GET_COLOR_IN_VARIATION = `${API_URL}/api/color/list-color`
export const GET_VARIATION_LIST = `${API_URL}/api/products/get-variation`
export const DELETE_VARIATION = `${API_URL}/api/products/delete-variation`
export const ADD_NEW_VARIATION = `${API_URL}/api/products/update-variation`
export const UPLOAD_FILE_VARIATION = `${API_URL}/api/utils/upload?type=product`

export const GET_CATEGORIES = `${API_URL}/api/category/list-category`
export const GET_CATEGORY_DETAIL = `${API_URL}/api/category/get-category`
export const ADD_NEW_CATEGORY = `${API_URL}/api/category/add-new-category`
export const UPDATE_CATEGORY = `${API_URL}/api/category/update-category`
export const DELETE_CATEGORY = `${API_URL}/api/category/delete-category`
export const UPLOAD_FILE_CATEGORY = `${API_URL}/api/utils/upload?type=category`

export const GET_SUBCATEGORIES_LIST = `${API_URL}/api/subcategory/list-subcategory`
export const GET_SUBCATEGORY_DETAIL = `${API_URL}/api/subcategory/get-subcategory`
export const ADD_NEW_SUBCATEGORY = `${API_URL}/api/subcategory/add-new-subcategory`
export const UPDATE_SUBCATEGORY = `${API_URL}/api/subcategory/update-subcategory`
export const DELETE_SUBCATEGORY = `${API_URL}/api/subcategory/delete-subcategory`
export const GET_CATEGORIES_LIST_FOR_SUBCATEGORY = `${API_URL}/api/category/list-category`
export const UPLOAD_FILE_SUBCATEGORY = `${API_URL}/api/utils/upload?type=subcategory`

export const GET_COLORS = `${API_URL}/api/color/list-color`
export const GET_COLOR_DETAIL = `${API_URL}/api/color/get-color`
export const ADD_NEW_COLOR = `${API_URL}/api/color/add-new-color`
export const UPDATE_COLOR = `${API_URL}/api/color/update-color`
export const DELETE_COLOR = `${API_URL}/api/color/delete-color`

export const GET_SIZES = `${API_URL}/api/size/list-size-list`
export const GET_SIZE_DETAIL = `${API_URL}/api/size/get-size`
export const ADD_NEW_SIZE = `${API_URL}/api/size/add-new-size`
export const UPDATE_SIZE = `${API_URL}/api/size/update-size`
export const DELETE_SIZE = `${API_URL}/api/size/delete-size`

export const GET_SIZE_CHART_LIST = `${API_URL}/api/sizechart/list-size-chart-list`
export const GET_SIZE_CHART_DETAIL = `${API_URL}/api/sizechart/get-size-chart`
export const ADD_NEW_SIZE_CHART = `${API_URL}/api/sizechart/add-new-size-chart`
export const UPDATE_SIZE_CHART = `${API_URL}/api/sizechart/update-size-chart`
export const DELETE_SIZE_CHART = `${API_URL}/api/sizechart/delete-size-chart`
export const GET_SIZES_FOR_SIZE_CHART = `${API_URL}/api/size/list-size-list`
export const GET_SIZES_FOR_SIZE_CHART_BY_TOP_OR_BOTTOM = `${API_URL}/api/sizechart/list`
export const UPLOAD_FILE_SIZECHART = `${API_URL}/api/utils/upload?type=sizechart`

export const GET_USERS = `${API_URL}/api/admin-user/list-admin-users`
export const GET_USER_DETAIL = `${API_URL}/api/admin-user/get-admin-user`
export const ADD_NEW_USER = `${API_URL}/api/admin-user/signup`
export const UPDATE_USER = `${API_URL}/api/admin-user/update-admin-user`
export const DELETE_USER = `${API_URL}/api/admin-user/delete-admin-user`

export const GET_NEWSLETTER_LIST = `${API_URL}/api/newsletter/`

export const GET_ECOM_USERS_LIST = `${API_URL}/api/users/admin/all`

export const GET_ALL_ORDERS = `${API_URL}/api/order/admin/all`
export const GET_DELIVERED_ORDERS = `${API_URL}/api/order/admin/delivered`
export const ADD_TRACKING_DETAIL = `${API_URL}/api/order/add-tracking-detail`

export const GET_CONTACT_US_LIST = `${API_URL}/api/contactUs/`

export const GET_DASHBOARD_DATA = `${API_URL}/api/admin-user/dashboard`

