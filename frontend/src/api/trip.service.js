import api from "./axios";

export const getTrips = async () => {
  const response = await api.get("/trips");
  return response.data?.data?.trips || response.data;
};

export const getTrip = async (id) => {
  const response = await api.get(`/trips/${id}`);
  return response.data?.data?.trip || response.data;
};

export const createTrip = async (data) => {
  const response = await api.post("/trips", data);
  return response.data?.data?.trip || response.data;
};

export const updateTrip = async (id, data) => {
  const response = await api.put(`/trips/${id}`, data);
  return response.data?.data?.trip || response.data;
};

export const dispatchTrip = async (id) => {
  const response = await api.patch(`/trips/${id}/dispatch`);
  return response.data?.data?.trip || response.data;
};

export const completeTrip = async (id, data) => {
  const response = await api.patch(`/trips/${id}/complete`, data);
  return response.data?.data?.trip || response.data;
};

export const cancelTrip = async (id) => {
  const response = await api.patch(`/trips/${id}/cancel`);
  return response.data?.data?.trip || response.data;
};

