import { api } from '../../lib/api';

export const orderService = {
  getOrders: async () => {
    const response = await api.get('/api/orders');
    return response.data;
  },
}; 