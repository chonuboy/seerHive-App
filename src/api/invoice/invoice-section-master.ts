import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /invoice-template/invoice-sections/{id}
export const fetchInvoiceSection = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/invoice-sections/${id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      }
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// PUT /invoice-template/invoice-sections/{id}
export const updateInvoiceSection = async (id: number, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}invoice-template/invoice-sections/${id}`, reqData, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      }
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// DELETE /invoice-template/invoice-sections/{id}
export const deleteInvoiceSection = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}invoice-template/invoice-sections/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      }
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /invoice-template/invoice-sections
export const fetchAllInvoiceSections = async () => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/invoice-sections`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      }
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /invoice-template/invoice-sections
export const createInvoiceSection = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}invoice-template/invoice-sections`, reqData, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      }
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};