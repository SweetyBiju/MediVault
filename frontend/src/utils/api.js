// frontend/src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5600/api", // backend URL
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Appointments APIs
export const getAppointments = (userId) => API.get(`/appointments/user/${userId}`);
export const getAppointmentCount = (userId) => API.get(`/appointments/count/${userId}`);
export const createAppointment = (data) => API.post(`/appointments`, data);
export const cancelAppointment = (id) => API.patch(`/appointments/${id}/cancel`);
export const requestChange = (id, data) =>
  axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/appointments/${id}/change-request`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
// export const decideChangeRequest = (id, data) => API.patch(`/appointments/${appointmentId}/change-decision`, data);

export const reviewChange = (id, data) => API.post(`/appointments/${id}/review-change`, data);

export default API;
