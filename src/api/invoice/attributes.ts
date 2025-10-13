import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /invoice-template/field-attributes/{id}
export const fetchFieldAttribute = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/field-attributes/${id}`, {
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

// PUT /invoice-template/field-attributes/{id}
export const updateFieldAttribute = async (id: number, reqData: {
  attributesSet: {
    attributesSetId: number;
  };
  attributeName: string;
  attributeValue: string;
}) => {
  try {
    const response = await axios.put(`${API_URL}invoice-template/field-attributes/${id}`, reqData, {
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

// DELETE /invoice-template/field-attributes/{id}
export const deleteFieldAttribute = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}invoice-template/field-attributes/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      }
    });
    return response;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /invoice-template/field-attributes
export const fetchAllFieldAttributes = async () => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/field-attributes`, {
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

// POST /invoice-template/field-attributes
export const createFieldAttribute = async (reqData: {
  attributesSet: {
    attributesSetId: number;
  };
  attributeName: string;
  attributeValue: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}invoice-template/field-attributes`, reqData, {
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

// GET /invoice-template/field-attributes/attributes-set/{attributesSetId}
export const fetchFieldAttributesBySetId = async (attributesSetId: number) => {
  try {
    const response = await axios.get(`${API_URL}invoice-template/field-attributes/attributes-set/${attributesSetId}`, {
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