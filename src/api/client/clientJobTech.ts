import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /api/job-tech/{jobTechId}
export const fetchJobTech = async (jobTechId: string) => {
  try {
    const response = await axios.get(`${API_URL}api/job-tech/${jobTechId}`);
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// PUT /api/job-tech/{jobTechId}
export const updateJobTech = async (jobTechId: string, reqData: any) => {
  try {
    const response = await axios.put(
      `${API_URL}api/job-tech/${jobTechId}`,
      reqData,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// DELETE /api/job-tech/{jobTechId}
export const deleteJobTech = async (jobTechId: string) => {
  try {
    const response = await axios.delete(`${API_URL}api/job-tech/${jobTechId}`,{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      }
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/job-tech
export const fetchAllJobTechs = async () => {
  try {
    const response = await axios.get(`${API_URL}api/job-tech`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`), // replace with your credentials
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/job-tech
export const createJobTech = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/job-tech`, reqData, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`), // replace with your credentials
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    return response;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};
