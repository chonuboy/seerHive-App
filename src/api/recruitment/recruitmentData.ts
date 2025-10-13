import { Email, Password } from "../creds";
import axios from "axios";
import { API_URL } from "../api_URL";

// GET /api/recruitment-data/{id}
export const fetchRecruitmentData = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}api/recruitment-data/${id}`, {
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

// PUT /api/recruitment-data/{id}
export const updateRecruitmentData = async (id: number, reqData: any) => {
  try {
    const response = await axios.put(
      `${API_URL}api/recruitment-data/${id}`,
      reqData,
      {
        method: "PUT",
        headers: {
          Authorization: "Basic " + btoa(`${Email}:${Password}`),
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    return response;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// DELETE /api/recruitment-data/{id}
export const deleteRecruitmentData = async (id: string) => {
  try {
    const response = await axios.delete(
      `${API_URL}api/recruitment-data/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Basic " + btoa(`${Email}:${Password}`),
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/recruitment-data/upload
export const uploadRecruitmentData = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${API_URL}api/recruitment-data/upload`,
      formData,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${Email}:${Password}`),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/recruitment-data/search
export const searchRecruitmentData = async (query: any, page?: number, resetEntries?: number) => {
  try {
    const response = await axios.post(
      `${API_URL}api/recruitment-data/search?page=${page}&size=${resetEntries}`,
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
    return response;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/recruitment-data/saveFromDifferentSources
export const saveRecruitmentDataFromSources = async (reqData: any) => {
  try {
    const response = await axios.post(
      `${API_URL}api/recruitment-data/saveFromDifferentSources`,
      reqData,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${Email}:${Password}`),
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/recruitment-data/resume/{id}
export const fetchRecruitmentResume = async (id: Number) => {
  try {
    const response = await axios.get(
      `${API_URL}api/recruitment-data/resume/${id}`,
      {
        responseType: "arraybuffer", // This is crucial for PDF files
        headers: {
          Accept: "application/pdf",
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

// POST /api/recruitment-data/resume/{id}
export const uploadRecruitmentResume = async (id: Number, file: any) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${API_URL}api/recruitment-data/resume/${id}`,
      formData,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${Email}:${Password}`),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/recruitment-data/add
export const addRecruitmentData = async (reqData: any) => {
  try {
    const response = await axios.post(
      `${API_URL}api/recruitment-data/add`,
      reqData,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${Email}:${Password}`),
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/recruitment-data/all
export const fetchAllRecruitmentData = async (
  page: number = 0,
  size: number = 12
) => {
  try {
    const response = await axios.get(`${API_URL}api/recruitment-data/all`, {
      params: {
        page,
        size,
      },
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

export const uploadRecruitmentCandidateResume = async (file: any) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${API_URL}api/recruitment-data/resume`,
      file,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${Email}:${Password}`),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};
