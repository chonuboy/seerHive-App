import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /api/clients/{id}
export const fetchClient = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}api/clients/${id}`, {
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

export const searchCandidates = async (query: any) => {
  try {
    const response = await axios.post(
      `${API_URL}api/search/candidates`,
      query,
      {
        method: "POST",
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

export const searchClient = async (query: any, page: number, size: number) => {
  try {
    const response = await axios.get(
      `${API_URL}api/clients/search?keyword=${query}&page=${page}&size=${size}`,
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

// PUT /api/clients/{id}
export const updateClient = async (id: number, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/clients/${id}`, reqData, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    return response;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// DELETE /api/clients/{id}
export const deleteClient = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}api/clients/${id}`, {
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

// GET /api/clients
export const fetchAllClients = async (page: number = 0, size: number = 10) => {
  try {
    const response = await axios.get(`${API_URL}api/clients`, {
      params: {
        page,
        size,
      },
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
        "Content-Type": "application/json",
      },
    });
    const data = response.data;
    const totalPages = Math.ceil(data.totalElements / size);
    return {
      content: data.content,
      totalPages,
      currentPage: page,
      totalElements: data.totalElements,
    };
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/clients
export const createClient = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/clients`, reqData, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    return response;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

export const getClientsCount = async () => {
  try {
    const response = await axios.get(`${API_URL}api/clients?page=0&size=100`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
        "Content-Type": "application/json",
      },
    });
    return response.data.totalElements;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

export const getAllClients = async () => {
  try {
    const response = await axios.get(`${API_URL}api/clients?page=0&size=100`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
        "Content-Type": "application/json",
      },
    });
    return response.data.content;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

export const getOverAllClients = async () => {
  try {
    const response = await axios.get(`${API_URL}api/clients?page=0&size=100`, {
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
