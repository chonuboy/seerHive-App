import axios from "axios";
import { API_URL } from "../api_URL";
import { Email,Password } from "../creds";


// GET /api/technologies/{id}

export const fetchTechnology = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}api/technologies/${id}`, {
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

// PUT /api/technologies/{id}
export const updateTechnology = async (id: string, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/technologies/${id}`, reqData, {
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

// DELETE /api/technologies/{id}
export const deleteTechnology = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}api/technologies/${id}`, {
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

// GET /api/technologies
export const fetchAllTechnologies = async () => {
  try {
    const response = await axios.get(`${API_URL}api/technologies`, {
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

// POST /api/technologies
export const createTechnology = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/technologies`, reqData, {
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