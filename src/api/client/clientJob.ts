import axios from "axios";
import { API_URL } from "../api_URL";
import { Email,Password } from "../creds";

// GET /api/jobs/{jobId}
export const fetchJob = async (jobId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`), // replace with your credentials
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// PUT /api/jobs/{jobId}
export const updateJob = async (jobId: number, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/jobs/${jobId}`, reqData, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`), // replace with your credentials
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    return response;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// DELETE /api/jobs/{jobId}
export const deleteJob = async (jobId: string) => {
  try {
    const response = await axios.delete(`${API_URL}api/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`), // replace with your credentials
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/jobs
export const fetchAllJobs = async (currentPage: number, size: number) => {
  try {
    const response = await axios.get(`${API_URL}api/jobs?page=${currentPage}&size=${size}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`), // replace with your credentials
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/jobs
export const createJob = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/jobs`, reqData, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`), // replace with your credentials
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    return response;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/jobs/jd/{jobId}

export const fetchJobDescription = async (jobId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/jobs/jd/${jobId}`, {
      responseType: 'arraybuffer', // This is crucial for PDF files
      headers: {
        "Accept": "application/pdf",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: 'Basic ' + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/jobs/jd/{jobId}
  export const uploadJobDescriptionById = async (jobId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(`${API_URL}api/jobs/jd/${jobId}`, formData, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${Email}:${Password}`), // replace with your credentials
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err: any) {
      return err.response ? err.response.data : err.message;
    }
  };

// GET /api/jobs/client/{clientId}/jobs
export const fetchJobsByClient = async (clientId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/jobs/client/${clientId}/jobs`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`), // replace with your credentials
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err;
  }
};

export const uploadJD = async (reqData:any) => {
  try {
    const response = await axios.post(`${API_URL}api/jobs/jd`, reqData, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    console.error("Upload error:", err);
    return err.response ? err.response.data : err.message;
  }
};

export const searchJob = async (query: any, page: number, size: number) => {
  try {
    const response = await axios.get(
      `${API_URL}api/jobs/search?keyword=${query}&page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: "Basic " + btoa(`${Email}:${Password}`),
        },
      }
    );
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};