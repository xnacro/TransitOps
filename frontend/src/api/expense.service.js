import api from "./axios";

export const getExpenses = async () => {
  const response = await api.get("/expenses");
  return response.data?.data?.expenses || response.data;
};

export const getExpense = async (id) => {
  const response = await api.get(`/expenses/${id}`);
  return response.data?.data?.expense || response.data;
};

export const createExpense = async (data) => {
  const response = await api.post("/expenses", data);
  return response.data?.data?.expense || response.data;
};

export const updateExpense = async (id, data) => {
  const response = await api.put(`/expenses/${id}`, data);
  return response.data?.data?.expense || response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

