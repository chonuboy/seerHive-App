import { API_URL } from "../api_URL";
import axios from "axios";
import { Email,Password } from "../creds";


export const fetchUserByEmail = async (email: string) => {
  try{ 
    const response = await axios.get(`${API_URL}/users/email/${email}`,{
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${Email}:${Password}`),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }catch (err: any) {
    console.log(err);
  }
};

export const updateUser = async (reqData: any, id: string) => {
  try {
    const response = await axios.put(
      `${API_URL}users/update/${id}`,
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
    return response.data; // Axios automatically parses the JSON response
  } catch (err: any) {
    // Axios throws an error for non-2xx status codes, you can access `err.response`
    return err.response ? err.response.data : err.message;
  }
};

export const createUser = async (reqData: any) => {
  try {
    const response = await axios.post(`${API_URL}users/create`, reqData, {
      method: "POST",
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

export const fetchUser = async (id: any) => {
  try {
    const response = await axios.get(`${API_URL}users/${id}`, {
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


export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}users/all`, {
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


export const deleteUser = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}users/delete/${id}`, {
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