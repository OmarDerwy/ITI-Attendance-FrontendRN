import axiosBackendInstance from './axios';

export const getUserNotifications = async () => {
  try {
    const response = await axiosBackendInstance.get('/api/v1/lost-and-found/notifications');
    console.log('Notifications response:', response.data.results);
    return Array.isArray(response.data.results) ? response.data.results : [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: number) => {
  try {
    const response = await axiosBackendInstance.post(
      `/api/v1/lost-and-found/notifications/${notificationId}/mark_as_read/`
    );
    console.log('Mark as read response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axiosBackendInstance.post(
      '/api/v1/lost-and-found/notifications/mark_all_as_read/'
    );
    console.log('Mark all as read response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const deleteNotification = async (id: number) => {
    try {
      const response = await axiosBackendInstance.delete(
        `/api/v1/lost-and-found/notifications/${id}/`
      );
      console.log('Delete notification response:', response.data);
      return response.data;
    }
    catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };