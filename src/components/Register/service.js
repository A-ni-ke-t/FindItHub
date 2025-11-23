import {  axiosApi } from "../../helpers/api_helper"


export const register = async (userData) => {
  try {
    const response = await axiosApi.post("/auth/register", userData)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};