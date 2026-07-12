import api from "./axios";

export const getMaintenanceLogs = async () => {
  const response = await api.get("/maintenance");
  return response.data;
};

export const getMaintenance = async (id) => {
  const response = await api.get(`/maintenance/${id}`);
  return response.data;
};

export const createMaintenance = async (data) => {
  const response = await api.post("/maintenance", data);
  return response.data;
};

export const updateMaintenance = async (id, data) => {
  const response = await api.put(`/maintenance/${id}`, data);
  return response.data;
};

export const closeMaintenance = async (id) => {
  const response = await api.patch(`/maintenance/${id}/close`);
  return response.data;
};

export const deleteMaintenance = async (id) => {
  const response = await api.delete(`/maintenance/${id}`);
  return response.data;
};
