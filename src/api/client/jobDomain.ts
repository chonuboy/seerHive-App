import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /api/client-job-domain/{id}
// GET /api/client-job-domain/{id}
export const fetchClientJobDomain = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}api/client-job-domain/${id}`, {
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

// PUT /api/client-job-domain/{id}
export const updateClientJobDomain = async (id: string, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/client-job-domain/${id}`, reqData, {
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

// DELETE /api/client-job-domain/{id}
export const deleteClientJobDomain = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}api/client-job-domain/${id}`, {
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

// GET /api/client-job-domain
export const fetchAllClientJobDomains = async () => {
  try {
    const response = await axios.get(`${API_URL}api/client-job-domain`, {
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

// POST /api/client-job-domain
export const createClientJobDomain = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/client-job-domain`, reqData, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    return response;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/client-job-domain/job/{jobId}
export const fetchClientJobDomainsByJob = async (jobId: string) => {
  try {
    const response = await axios.get(`${API_URL}api/client-job-domain/job/${jobId}`, {
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