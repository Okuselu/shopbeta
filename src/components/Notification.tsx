//src/components/Notification
import React from "react";
import { NotificationProps } from "../types/notification.types";

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  if (!message) return null;

  const notificationStyles = {
    success: { backgroundColor: "#d4edda", color: "#155724" },
    error: { backgroundColor: "#f8d7da", color: "#721c24" },
  };

  return (
    <div
      className="notification"
      style={{
        padding: "10px",
        borderRadius: "4px",
        marginBottom: "10px",
        ...(type ? notificationStyles[type] : {}),
      }}
    >
      {message}
    </div>
  );
};

export default Notification;
