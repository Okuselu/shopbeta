import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

interface StatusNotificationProps {
  show: boolean;
  status: string;
  onClose: () => void;
}

const StatusNotification: React.FC<StatusNotificationProps> = ({
  show,
  status,
  onClose,
}) => {
  const getStatusMessage = (status: string) => {
    switch (status) {
      case "Payment Confirmed":
        return "Your payment has been confirmed!";
      case "Processing":
        return "Your order is being processed.";
      case "Shipped":
        return "Your order has been shipped!";
      case "Delivered":
        return "Your order has been delivered!";
      default:
        return "Order status updated";
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast show={show} onClose={onClose} delay={3000} autohide>
        <Toast.Header>
          <strong className="me-auto">Order Update</strong>
          <small>just now</small>
        </Toast.Header>
        <Toast.Body>{getStatusMessage(status)}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default StatusNotification;
