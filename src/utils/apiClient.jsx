// utils/apiClient.js

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const apiClient = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };

  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    const data = await response.json();

    // Handle expired/invalid token globally
    if (response.status === 401 || data.message?.toLowerCase().includes("expired")) {
      toast.error("Session expired. Redirecting to login...");
      localStorage.clear();
      setTimeout(() => {
        window.location.href = '/auth'; // or use navigate() in context
      }, 3000);
      return;
    }

    return data;
  } catch (error) {
    toast.error("Network or server error.");
    console.error("API Error:", error);
    throw error;
  }
};