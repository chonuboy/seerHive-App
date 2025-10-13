import axios from "axios";
import { API_URL } from "../api_URL";
import { Email,Password } from "../creds";


// GET /api/domains/{id}
export const fetchDomain = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}api/domains/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// PUT /api/domains/{id}
export const updateDomain = async (id: string, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/domains/${id}`, reqData, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// DELETE /api/domains/{id}
export const deleteDomain = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}api/domains/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/domains
export const fetchAllDomains = async () => {
  try {
    const response = await axios.get(`${API_URL}api/domains`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/domains
export const createDomain = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/domains`, reqData, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};