import api from './axiosInstance';

export const createReservation = (data) => api.post('/reservations', data);
export const getReservations = (params) => api.get('/reservations', { params });
export const cancelReservation = (id) => api.delete(`/reservations/${id}`);
