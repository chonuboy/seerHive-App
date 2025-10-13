import axios from "axios";
import { API_URL } from "../api_URL";
import { Email, Password } from "../creds";

// GET /api/interview-rounds/{id}
export const fetchInterviewRound = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}api/interview-rounds/${id}`, {
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

// PUT /api/interview-rounds/{id}
export const updateInterviewRound = async (id: number, reqData: any) => {
  try {
    const response = await axios.put(
      `${API_URL}api/interview-rounds/${id}`,
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

// DELETE /api/interview-rounds/{id}
export const deleteInterviewRound = async (id: string) => {
  try {
    const response = await axios.delete(
      `${API_URL}api/interview-rounds/${id}`,
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

// GET /api/interview-rounds
export const fetchAllInterviewRounds = async () => {
  try {
    const response = await axios.get(`${API_URL}api/interview-rounds`, {
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

// POST /api/interview-rounds
export const createInterviewRound = async (reqData: any) => {
  try {
    const response = await axios.post(
      `${API_URL}api/interview-rounds`,
      reqData,
      {
        method: "POST",
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

// GET /api/interview-rounds/contact/{contactId}
export const fetchInterviewRoundsByContact = async (contactId: number) => {
  try {
    const response = await axios.get(
      `${API_URL}api/interview-rounds/contact/${contactId}`,
      {
        method: "GET",
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

// GET /api/interview-rounds/contact/{contactId}/job/{jobId}
export const fetchInterviewRoundsByContactAndJob = async (
  contactId: number,
  jobId: number
) => {
  try {
    const response = await axios.get(
      `${API_URL}api/interview-rounds/contact/${contactId}/job/${jobId}`,
      {
        method: "GET",
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

export async function uploadImageSnap(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file); // Use 'image' or whatever field name your API expects

    const response = await axios.post(
      `${API_URL}api/interview-rounds/interview-image`,
      formData,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Authorization: "Basic " + btoa(`${Email}:${Password}`),
        },
      }
    );

    return response.data;
  } catch (err: any) {
    console.error("Image upload error:", err);
    throw err; // Rethrow to handle in the component
  }
}

// Add this to your API file
export async function getRoundImage(roundId: number): Promise<string> {
  try {
    const response = await axios.get(
      `${API_URL}api/interview-rounds/interview-image/${roundId}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Authorization: "Basic " + btoa(`${Email}:${Password}`),
          "Content-Type": "application/json",
        },
        responseType: 'arraybuffer', // Important for binary data
      }
    );

    // Convert binary data to base64
    const base64 = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    
    return base64;
  } catch (err: any) {
    console.error("Round image fetch error:", err);
    throw err;
  }
}


export async function uploadImageSnapForRound(file: File, roundId: number) {
  try {
    const formData = new FormData();
    formData.append("file", file); // Use 'image' or whatever field name your API expects

    const response = await axios.post(
      `${API_URL}api/interview-rounds/interview-image/${roundId}`,
      formData,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Authorization: "Basic " + btoa(`${Email}:${Password}`),
        },
      }
    );

    return response.data;
  } catch (err: any) {
    console.error("Image upload error:", err);
    throw err; // Rethrow to handle in the component
  }
}




