import axios from "axios";
import { API_URL } from "../api_URL";
import { Email,Password } from "../creds";


// GET /api/contact-interviews/{id}
export const fetchContactInterview = async (id: Number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-interviews/${id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// PUT /api/contact-interviews/{id}
export const updateContactInterview = async (id: string, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/contact-interviews/${id}`, reqData, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// DELETE /api/contact-interviews/{id}
export const deleteContactInterview = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}api/contact-interviews/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/contact-interviews
export const fetchAllContactInterviews = async () => {
  try {
    const response = await axios.get(`${API_URL}api/contact-interviews?page=0&size=100`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// POST /api/contact-interviews
export const createContactInterview = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/contact-interviews`, reqData, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/contact-interviews/job/{jobId}/contacts
export const fetchContactsByJob = async (jobId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-interviews/job/${jobId}/contacts`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/contact-interviews/job/contact/{contactId}
export const fetchInterviewsByContact = async (contactId: Number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-interviews/job/contact/${contactId}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};

// GET /api/contact-interviews/contact/{contactId}/client/{clientId}
export const fetchInterviewsByContactAndClient = async (contactId: number, clientId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-interviews/contact/${contactId}/client/${clientId}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};


export const fetchInterviewsByClientId = async (clientId: number) => {
  try {
    const response = await axios.get(`${API_URL}api/contact-interviews/client/${clientId}/interviews`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: "Basic " + btoa(`${Email}:${Password}`),
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response ? err.response.data : err.message;
  }
};





