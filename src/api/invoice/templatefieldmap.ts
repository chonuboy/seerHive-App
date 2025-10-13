import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /invoice-template/template-field-maps/{id}
export const fetchTemplateFieldMap = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/template-field-maps/${id}`, {
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

// PUT /invoice-template/template-field-maps/{id}
export const updateTemplateFieldMap = async (id: number, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}invoice-template/template-field-maps/${id}`, reqData, {
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

// DELETE /invoice-template/template-field-maps/{id}
export const deleteTemplateFieldMap = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}invoice-template/template-field-maps/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      }
    });
    return response
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/template-field-maps
export const fetchAllTemplateFieldMaps = async () => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/template-field-maps?page=0&size=100`, {
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

// POST /api/template-field-maps
export const createTemplateFieldMap = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}invoice-template/template-field-maps`, reqData, {
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

// GET /invoice-template/template-field-maps/by-template/{templateId}
export const fetchTemplateFieldMapsByTemplate = async (templateId: number) => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/template-field-maps/by-template/${templateId}?page=0&size=100`, {
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

// GET /invoice-template/template-field-maps/by-field/{fieldId}
export const fetchTemplateFieldMapsByField = async (fieldId: number) => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/template-field-maps/by-field/${fieldId}`, {
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