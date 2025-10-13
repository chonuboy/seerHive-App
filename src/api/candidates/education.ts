import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /api/educations/{id}
export const fetchEducation = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}api/educations/${id}`, {
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

// PUT /api/educations/{id}
export const updateEducation = async (id: number, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/educations/${id}`, reqData, {
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

// DELETE /api/educations/{id}
export const deleteEducation = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}api/educations/${id}`, {
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

// GET /api/educations
export const fetchAllEducations = async () => {
  try {
    const response = await axios.get(`${API_URL}api/educations`, {
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

// POST /api/educations
export const createEducation = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/educations`, reqData, {
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

// GET /api/educations/contact/{contactId}
export const fetchEducationsByContact = async (contactId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/educations/contact/${contactId}`, {
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
