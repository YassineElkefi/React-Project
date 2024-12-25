import React, { useEffect, useState } from 'react';

export const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch('http://localhost:3001/api/v1/notifications/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-20 right-4 z-50">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className="bg-white shadow-lg rounded-lg p-4 mb-2 border-l-4 border-green-500"
        >
          <p className="text-sm">{notification.content}</p>
          <span className="text-xs text-gray-500">
            {new Date(notification.createdAt).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
};