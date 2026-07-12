import api from "./axios";

export const getFuelEfficiency = async () => {
  const response = await api.get("/reports/fuel-efficiency");
  return response.data?.data || response.data;
};

export const getFleetUtilization = async () => {
  const response = await api.get("/reports/fleet-utilization");
  return response.data?.data || response.data;
};

export const getRevenue = async () => {
  const response = await api.get("/reports/revenue");
  return response.data?.data || response.data;
};

export const getOperationalCost = async () => {
  const response = await api.get("/reports/operational-cost");
  return response.data?.data || response.data;
};

export const getMaintenanceCost = async () => {
  const response = await api.get("/reports/maintenance-cost");
  return response.data?.data || response.data;
};

export const getExpenseSummary = async () => {
  const response = await api.get("/reports/expense-summary");
  return response.data?.data || response.data;
};

export const getVehiclePerformance = async () => {
  const response = await api.get("/reports/vehicle-performance");
  return response.data?.data || response.data;
};

export const exportCsv = async (reportType) => {
  const response = await api.get(`/reports/${reportType}?format=csv`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${reportType}-report.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

