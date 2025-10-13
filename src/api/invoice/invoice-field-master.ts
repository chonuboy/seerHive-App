import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /invoice-template/invoice-fields/{id}
export const fetchInvoiceField = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/invoice-fields/${id}`, {
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

// PUT /invoice-template/invoice-fields/{id}
export const updateInvoiceField = async (id: number, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}invoice-template/invoice-fields/${id}`, reqData, {
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

// DELETE /invoice-template/invoice-fields/{id}
export const deleteInvoiceField = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}invoice-template/invoice-fields/${id}`, {
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

// GET /invoice-template/invoice-fields
export const fetchAllInvoiceFields = async () => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/invoice-fields?page=0&size=100`, {
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

// POST /invoice-template/invoice-fields
export const createInvoiceField = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}invoice-template/invoice-fields`, reqData, {
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