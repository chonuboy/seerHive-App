import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";


// GET /api/certifications/{id}
export const fetchCertification = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}api/certifications/${id}`, {
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

// PUT /api/certifications/{id}
export const updateCertification = async (id: string, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/certifications/${id}`, reqData, {
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

// DELETE /api/certifications/{id}
export const deleteCertification = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}api/certifications/${id}`, {
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

// GET /api/certifications
export const fetchAllCertifications = async () => {
  try {
    const response = await axios.get(`${API_URL}api/certifications`, {
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

// POST /api/certifications
export const createCertification = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/certifications`, reqData, {
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