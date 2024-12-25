import React, { useEffect, useState } from 'react';
import { notificationService } from '../../services/notificationService';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification ${notification.read ? 'read' : 'unread'}`}>
          <p>{notification.message}</p>
          <div className="notification-actions">
            {!notification.read && (
              <button onClick={() => handleMarkAsRead(notification.id)}>Mark as Read</button>
            )}
            <button onClick={() => handleDelete(notification.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;