import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /invoice-template/invoice-templates/{id}
export const fetchInvoiceTemplate = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/invoice-templates/${id}`, {
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

// PUT /invoice-template/invoice-templates/{id}
export const updateInvoiceTemplate = async (id: number, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}invoice-template/invoice-templates/${id}`, reqData, {
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

// DELETE /invoice-template/invoice-templates/{id}
export const deleteInvoiceTemplate = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}invoice-template/invoice-templates/${id}`, {
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

// GET /invoice-templates
export const fetchAllInvoiceTemplates = async () => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/invoice-templates`, {
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

// POST /invoice-templates
export const createInvoiceTemplate = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}invoice-template/invoice-templates`, reqData, {
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