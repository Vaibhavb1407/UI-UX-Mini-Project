import api from './axiosInstance';

export const getCustomers = () => api.get('/customers');
export const getCustomerById = (id) => api.get(`/customers/${id}`);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const redeemPoints = (id, pointsToRedeem) =>
    api.put(`/customers/${id}/redeem`, { pointsToRedeem });
