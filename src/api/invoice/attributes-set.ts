import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /invoice-template/field-attributes-set/{id}
export const fetchFieldAttributesSet = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/field-attributes-set/${id}`, {
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

// PUT /invoice-template/field-attributes-set/{id}
export const updateFieldAttributesSet = async (id: number, reqData: {
  category: string;
  templateFieldMap: {
    templateFieldMapId: number;
  };
}) => {
  try {
    const response = await axios.put(`${API_URL}invoice-template/field-attributes-set/${id}`, reqData, {
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

// DELETE /invoice-template/field-attributes-set/{id}
export const deleteFieldAttributesSet = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}invoice-template/field-attributes-set/${id}`, {
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

// GET /api/field-attributes-set
export const fetchAllFieldAttributesSets = async () => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/field-attributes-set`, {
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

// POST /api/field-attributes-set
export const createFieldAttributesSet = async (reqData: {
  category: string;
  templateFieldMap: {
    templateFieldMapId: number;
  };
}) => {
  try {
    const response = await axios.post(`${API_URL}invoice-template/field-attributes-set`, reqData, {
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