import axios from "axios";
import { API_URL } from "../api_URL";
import { Email,Password } from "../creds";

// GET /api/contact-preferred-locations/{id}
export const fetchContactPreferredLocation = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-preferred-locations/${id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// PUT /api/contact-preferred-locations/{id}
export const updateContactPreferredLocation = async (id: string, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/contact-preferred-locations/${id}`, reqData, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// DELETE /api/contact-preferred-locations/{id}
export const deleteContactPreferredLocation = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}api/contact-preferred-locations/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/contact-preferred-locations
export const fetchAllContactPreferredLocations = async () => {
  try {
    const response = await axios.get(`${API_URL}api/contact-preferred-locations`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/contact-preferred-locations
export const createContactPreferredLocation = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/contact-preferred-locations`, reqData, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};