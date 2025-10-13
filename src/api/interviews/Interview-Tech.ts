import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /api/interview-tech/{interviewTechId}
export const fetchInterviewTech = async (interviewTechId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/interview-tech/${interviewTechId}`, {
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

// PUT /api/interview-tech/{interviewTechId}
export const updateInterviewTech = async (interviewTechId: number, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/interview-tech/${interviewTechId}`, reqData, {
      method: 'PUT',
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

// DELETE /api/interview-tech/{interviewTechId}
export const deleteInterviewTech = async (interviewTechId: number) => {
  try {
    const response = await axios.delete(`${API_URL}api/interview-tech/${interviewTechId}`, {
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

// GET /api/interview-tech
export const fetchAllInterviewTechs = async () => {
  try {
    const response = await axios.get(`${API_URL}api/interview-tech`, {
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

// POST /api/interview-tech
export const createInterviewTech = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/interview-tech`, reqData, {
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