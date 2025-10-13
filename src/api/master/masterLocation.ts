// GET /api/locations/{id}

import axios from "axios";
import { API_URL } from "../api_URL";
import { Email } from "../creds";
import { Password } from "../creds";
export const fetchLocation = async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}api/locations/${id}`,{
        method: "GET",
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
  
  // PUT /api/locations/{id}
  export const updateLocation = async (id: string, reqData: any) => {
    try {
      const response = await axios.put(`${API_URL}api/locations/${id}`, reqData, {
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
  
  // DELETE /api/locations/{id}
  export const deleteLocation = async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}api/locations/${id}`,{
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
  
  // GET /api/locations
  export const fetchAllLocations = async () => {
    try {
      const response = await axios.get(`${API_URL}api/locations`,{
        method: "GET",
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
  
  // POST /api/locations
  export const createLocation = async (reqData: any) => {
    try {
      const response = await axios.post(`${API_URL}api/locations`,reqData, {
        method:"POST",
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