import axios from "axios";
import { API_URL } from "../api_URL";
import { Email,Password } from "../creds";

// GET /api/client-locations/{locationId}
export const fetchClientLocation = async (locationId: string) => {
  try {
    const response = await axios.get(`${API_URL}api/client-locations/${locationId}`, {
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

// PUT /api/client-locations/{locationId}
export const updateClientLocation = async (locationId: number, reqData: any) => {
  try {
    const response = await axios.put(`${API_URL}api/client-locations/${locationId}`, reqData, {
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

// DELETE /api/client-locations/{locationId}
export const deleteClientLocation = async (locationId: string) => {
  try {
    const response = await axios.delete(`${API_URL}api/client-locations/${locationId}`, {
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

// GET /api/client-locations
export const fetchAllClientLocations = async () => {
  try {
    const response = await axios.get(`${API_URL}api/client-locations`, {
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

// POST /api/client-locations
export const createClientLocation = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}api/client-locations`, reqData, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    return response;
  } catch (err: any) {
    return err.response.data;
  }
};