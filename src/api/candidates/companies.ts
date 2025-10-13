import axios from "axios";
import { API_URL } from "../api_URL";
import { Email,Password } from "../creds";

// GET /api/contact-company/{contactCompanyId}
export const fetchContactCompany = async (contactCompanyId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-company/${contactCompanyId}`, {
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

// PUT /api/contact-company/{contactCompanyId}
export const updateContactCompany = async (contactCompanyId: number, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/contact-company/${contactCompanyId}`, reqData, {
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

// DELETE /api/contact-company/{contactCompanyId}
export const deleteContactCompany = async (contactCompanyId: number) => {
  try {
    const response = await axios.delete(`${API_URL}api/contact-company/${contactCompanyId}`, {
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

// GET /api/contact-company
export const fetchAllContactCompanies = async () => {
  try {
    const response = await axios.get(`${API_URL}api/contact-company`, {
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

// POST /api/contact-company
export const createContactCompany = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/contact-company`, reqData, {
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

// GET /api/contact-company/contactCompany/{contactId}
export const fetchContactCompaniesByContactId = async (contactId: string) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-company/contactCompany/${contactId}`, {
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