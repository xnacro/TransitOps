import api from "./axios";

export const getFuelLogs = async () => {
  const response = await api.get("/fuel-logs");
  return response.data?.data?.fuel_logs || response.data;
};

export const getFuelLog = async (id) => {
  const response = await api.get(`/fuel-logs/${id}`);
  return response.data?.data?.fuel_log || response.data;
};

export const createFuelLog = async (data) => {
  const response = await api.post("/fuel-logs", data);
  return response.data?.data?.fuel_log || response.data;
};

export const deleteFuelLog = async (id) => {
  const response = await api.delete(`/fuel-logs/${id}`);
  return response.data;
};

