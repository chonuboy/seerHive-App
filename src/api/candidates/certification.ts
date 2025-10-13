import axios from "axios";
import { API_URL } from "../api_URL";
import { Email,Password } from "../creds";

// GET /api/contact-certification/{contactCertificationId}
export const fetchContactCertification = async (contactCertificationId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-certification/${contactCertificationId}`, {
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

// PUT /api/contact-certification/{contactCertificationId}
export const updateContactCertification = async (contactCertificationId: number, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/contact-certification/${contactCertificationId}`, reqData, {
      method: "PUT",
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

// DELETE /api/contact-certification/{contactCertificationId}
export const deleteContactCertification = async (contactCertificationId: any) => {
  try {
    const response = await axios.delete(`${API_URL}api/contact-certification/${contactCertificationId}`, {
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

// GET /api/contact-certification
export const fetchAllContactCertifications = async () => {
  try {
    const response = await axios.get(`${API_URL}api/contact-certification`, {
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

// POST /api/contact-certification
export const createContactCertification = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/contact-certification`, reqData, {
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

// GET /api/contact-certification/contact/{contactId}
export const fetchContactCertificationsByContact = async (contactId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-certification/contact/${contactId}`, {
      method: "GET",
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