import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /api/leads/{id}
export const fetchLead = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}api/leads/${id}`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// PUT /api/leads/{id}
export const updateLead = async (id: string, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/leads/${id}`, reqData, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// DELETE /api/leads/{id}
export const deleteLead = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}api/leads/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/leads
export const fetchAllLeads = async () => {
  try {
    const response = await axios.get(`${API_URL}api/leads`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/leads
export const createLead = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/leads`, reqData, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/leads/upload
export const uploadLeads = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${API_URL}api/leads/upload`, formData, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/leads/filter
export const filterLeads = async (filters: any) => {
  try {
    const response = await axios.post(`${API_URL}api/leads/filter`, filters, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/leads/search
export const searchLeads = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}api/leads/search`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
        "Content-Type": "application/json",
      },
      params: { query },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/leads/distinct/skills
export const fetchDistinctSkills = async () => {
  try {
    const response = await axios.get(`${API_URL}api/leads/distinct/skills`, {
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

// GET /api/leads/distinct/residing-country
export const fetchDistinctResidingCountries = async () => {
  try {
    const response = await axios.get(`${API_URL}api/leads/distinct/residing-country`, {
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

// GET /api/leads/distinct/current-company
export const fetchDistinctCurrentCompanies = async () => {
  try {
    const response = await axios.get(`${API_URL}api/leads/distinct/current-company`, {
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