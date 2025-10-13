import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /api/contact-hiring-types/{id}
export const getContactHiringType = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-hiring-types/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// PUT /api/contact-hiring-types/{id}
export const updateContactHiringType = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}api/contact-hiring-types/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// DELETE /api/contact-hiring-types/{id}
export const deleteContactHiringType = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}api/contact-hiring-types/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/contact-hiring-types
export const getContactHiringTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}api/contact-hiring-types`, {
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/contact-hiring-types
export const createContactHiringType = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}api/contact-hiring-types`, data, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

export const getContactHiringTypeByContactId = async (contactId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-hiring-types/contact/${contactId}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
}