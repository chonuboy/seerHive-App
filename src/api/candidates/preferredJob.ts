import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /api/contact-preferred-job-types/{id}
export const getContactPreferredJobType = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-preferred-job-types/${id}`, {
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

// PUT /api/contact-preferred-job-types/{id}
export const updateContactPreferredJobType = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}api/contact-preferred-job-types/${id}`, data, {
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

// DELETE /api/contact-preferred-job-types/{id}
export const deleteContactPreferredJobType = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}api/contact-preferred-job-types/${id}`, {
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

// GET /api/contact-preferred-job-types
export const getContactPreferredJobTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}api/contact-preferred-job-types`, {
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

// POST /api/contact-preferred-job-types
export const createContactPreferredJobType = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}api/contact-preferred-job-types`, data, {
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

// GET /api/contact-preferred-job-types/contact/{contactID}
export const getContactPreferredJobTypeByContact = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-preferred-job-types/contact/${id}`, {
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
