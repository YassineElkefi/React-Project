const API_URL = 'http://localhost:3000/api';

export const notificationService = {
  getAllNotifications: async () => {
    const response = await fetch(`${API_URL}/notifications`, {
      credentials: 'include'
    });
    return response.json();
  },

  markAsRead: async (notificationId) => {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      credentials: 'include'
    });
    return response.json();
  },

  deleteNotification: async (notificationId) => {
    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return response.json();
  }
};