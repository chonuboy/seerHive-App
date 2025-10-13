import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /api/universities/{id}
export const fetchUniversityById = async (universityId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/universities/${universityId}`, {
      method: "GET",
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

// PUT /api/universities/{id}
export const updateUniversity = async (universityId: number, reqData: any) => {
  try {
    const response = await axios.put(
      `${API_URL}api/universities/${universityId}`,
      reqData,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: "Basic " + btoa(`${Email}:${Password}`),
        },
      }
    );
    return response;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// DELETE /api/universities/{id}
export const deleteUniversity = async (universityId: number) => {
  try {
    const response = await axios.delete(
      `${API_URL}api/universities/${universityId}`,
      {
        method: "DELETE",
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

// GET /api/universities
export const fetchAllUniversities = async () => {
  try {
    const response = await axios.get(`${API_URL}api/universities`, {
      method: "GET",
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

// POST /api/universities
export const createUniversity = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/universities`, reqData, {
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
