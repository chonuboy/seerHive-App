import axios from "axios";
import { API_URL } from "../api_URL";
import { Email,Password } from "../creds";

// GET /api/contact-technology/{id}
export const fetchContactTechnology = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-technology/${id}`, {
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

// PUT /api/contact-technology/{id}
  export const updateContactTechnology = async (id: number, reqData: any) => {
    try {
      const response = await axios.put(`${API_URL}api/contact-technology/${id}`, reqData, {
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

// DELETE /api/contact-technology/{id}
export const deleteContactTechnology = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}api/contact-technology/${id}`, {
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

// GET /api/contact-technology
export const fetchAllContactTechnologies = async () => {
  try {
    const response = await axios.get(`${API_URL}api/contact-technology`, {
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

// POST /api/contact-technology
export const createContactTechnology = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/contact-technology`, reqData, {
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