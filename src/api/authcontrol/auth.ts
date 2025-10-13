import axios from "axios";
import { API_URL } from "../api_URL";
import { Email,Password } from "../creds";

// POST /auth/reset-password
export const resetPassword = async (reqData: any) => {
    try {
      const response = await axios.post(`${API_URL}auth/reset-password`, reqData, {
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      return response;
    } catch (err: any) {
      return err.response ? err.response.data : err.message;
    }
  };
  
  // POST /auth/forgot-password
  export const forgotPassword = async (reqData: any) => {
    try {
      const response = await axios.post(`${API_URL}auth/forgot-password?emailOrUserName=${reqData.email}`, reqData, {
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      return response;
    } catch (err: any) {
      return err.response ? err.response.data : err.message;
    }
  };