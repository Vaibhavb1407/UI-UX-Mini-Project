import api from './axiosInstance';

export const createOrder = (data) => api.post('/orders', data);
export const getOrders = () => api.get('/orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const getActiveOrders = () => api.get('/chef/active');
export const updateOrderStatus = (id, status) =>
    api.put(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => api.delete(`/orders/${id}`);
