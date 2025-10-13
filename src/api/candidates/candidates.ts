import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

export const createCandidate = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}contacts/create`, reqData, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response; // Axios automatically parses the JSON response
  } catch (err: any) {
    // Axios throws an error for non-2xx status codes, you can access `err.response`
    return err.response.data;
  }
};

export async function uploadResume(reqData: any) {
  try {
    const response = await axios.post(`${API_URL}contacts/resume`, reqData, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
      // onUploadProgress: (progressEvent: any) => {
      //   const progress = Math.round(
      //     (progressEvent.loaded * 100) / progressEvent.total
      //   );
      //   console.log(progress);
      // },
    });
    return response.data;
  } catch (err: any) {
    console.error("Upload error:", err);
    return err.response ? err.response.data : err.message;
  }
}

export const updateCandidate = async (reqData: any, id: number) => {
  try {
    const response = await axios.put(`${API_URL}contacts/${id}`, reqData, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response; // Axios automatically parses the JSON response
  } catch (err: any) {
    // Axios throws an error for non-2xx status codes, you can access `err.response`
    return err.response ? err.response.data : err.message;
  }
};

export const fetchCandidates = async (page: number = 0, size: number = 100) => {
  try {
    const response = await axios.get(`${API_URL}contacts/allContacts`, {
      params: {
        page,
        size,
      },
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data; // Axios automatically parses the JSON response
  } catch (err: any) {
    // Axios throws an error for non-2xx status codes, you can access `err.response`
    return err.response ? err.response.data : err.message;
  }
};
// Only Accessible for Super Admin
export const deleteCandidates = async (candidateId: any) => {
  try {
    const response = await axios.delete(`${API_URL}contacts/${candidateId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data; // Axios automatically parses the JSON response
  } catch (err: any) {
    // Axios throws an error for non-2xx status codes, you can access `err.response`
    return err.response ? err.response.data : err.message;
  }
};

export const fetchCandidate = async (candidateId: any) => {
  try {
    const response = await axios.get(`${API_URL}contacts/${candidateId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data; // Axios automatically parses the JSON response
  } catch (err: any) {
    // Axios throws an error for non-2xx status codes, you can access `err.response`
    return err.response ? err.response.data : err.message;
  }
};

export const searchCandidates = async (query: any, page: number) => {
  try {
    const response = await axios.post(
      `${API_URL}api/search/candidates?page=${page}&size=12`,
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

export const contactSearchByKeyword = async (
  keyword: string,
  page: number,
  size: number
) => {
  try {
    const response = await axios.get(
      `${API_URL}contacts/searchByKeyword?keyword=${keyword}&page=${page}&size=${size}`,
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

export const fetchCandidateResume = async (candidateId: number) => {
  try {
    const response = await axios.get(
      `${API_URL}contacts/resume/${candidateId}`,
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
    throw err; // Consider throwing the error to handle it in the component
  }
};

export async function uploadCandidateResume(reqData: any, contactId: number) {
  try {
    const response = await axios.post(
      `${API_URL}contacts/resume/${contactId}`,
      reqData,
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: "Basic " + btoa(`${Email}:${Password}`),
        },
        onUploadProgress: (progressEvent: any) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(progress);
        },
      }
    );
    return response.data;
  } catch (err: any) {
    console.error("Upload error:", err);
    return err.response ? err.response.data : err.message;
  }
}

export async function uploadAutofillResume(reqData: any) {
  try {
    const response = await axios.post(`${API_URL}api/resume/parse`, reqData, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
      onUploadProgress: (progressEvent: any) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(progress);
      },
    });
    return response.data;
  } catch (err: any) {
    console.error("Upload error:", err);
    return err.response ? err.response.data : err.message;
  }
}

// 1. First, update your uploadImage function
export async function uploadImage(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file); // Use 'image' or whatever field name your API expects

    const response = await axios.post(`${API_URL}contacts/image`, formData, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    
    return response.data;
  } catch (err: any) {
    console.error("Image upload error:", err);
    throw err; // Rethrow to handle in the component
  }
}

export async function getCandidateCount(){
  try {
    const response = await axios.get(`${API_URL}contacts/allContacts?size=100`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data.totalElements;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
}

export async function getActiveContactsCount(){
  try {
    const response = await axios.get(`${API_URL}contacts/allContacts?size=100`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data.content;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
}


export async function getContactImage(id: number) {
  try {
    const response = await axios.get(`${API_URL}contacts/image/${id}`, {
      responseType: "blob", // Important: treat as binary
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });

    // Convert Blob to an object URL
    const imageUrl = URL.createObjectURL(response.data);
    return imageUrl;

  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
}

export async function uploadCandidateImage(file: File,contactId:any) {
  try {
    const formData = new FormData();
    formData.append('file', file); // Use 'image' or whatever field name your API expects

    const response = await axios.post(`${API_URL}contacts/image/${contactId}`, formData, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    
    return response;
  } catch (err: any) {
    console.error("Image upload error:", err);
    throw err; // Rethrow to handle in the component
  }
}