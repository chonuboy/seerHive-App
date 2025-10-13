import axios from "axios";
import { API_URL } from "../api_URL";
import { Email,Password } from "../creds";

export const fetchContactDomain = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-domains/${id}`, {
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

// PUT /api/contact-domains/{id}
export const updateContactDomain = async (id: string, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/contact-domains/${id}`, reqData, {
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

// DELETE /api/contact-domains/{id}
export const deleteContactDomain = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}api/contact-domains/${id}`, {
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

// GET /api/contact-domains
export const fetchAllContactDomains = async () => {
  try {
    const response = await axios.get(`${API_URL}api/contact-domains`, {
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

// POST /api/contact-domains
export const createContactDomain = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/contact-domains`, reqData, {
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