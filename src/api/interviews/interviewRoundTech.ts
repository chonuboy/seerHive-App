import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";


export const fetchInterviewTech = async (interviewTechId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/interview-tech/${interviewTechId}`, {
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


export const updateInterviewTech = async (interviewTechId: number, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/interview-tech/${interviewTechId}`, reqData, {
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


export const deleteInterviewTech = async (interviewTechId: number) => {
  try {
    const response = await axios.delete(`${API_URL}api/interview-tech/${interviewTechId}`, {
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


export const fetchAllInterviewTechs = async () => {
  try {
    const response = await axios.get(`${API_URL}api/interview-tech`, {
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

export const createInterviewTech = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/interview-tech`, reqData, {
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