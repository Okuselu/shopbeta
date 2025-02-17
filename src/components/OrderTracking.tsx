import React, { useState, useEffect } from "react";
import StatusNotification from "./StatusNotification";

interface OrderTrackingProps {
  status: string;
  createdAt: string;
  updatedAt: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({
  status,
  createdAt,
  updatedAt,
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const [prevStatus, setPrevStatus] = useState(status);

  useEffect(() => {
    if (status !== prevStatus) {
      setShowNotification(true);
      setPrevStatus(status);
    }
  }, [status, prevStatus]);

  const steps = [
    "Order Placed",
    "Payment Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
  ];
  const currentStep = steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;

  return (
    <>
      <StatusNotification 
        show={showNotification}
        status={status}
        onClose={() => setShowNotification(false)}
      />
      
      <div className="order-tracking my-4">
        <h5>Order Status</h5>
        <div className="position-relative">
          <div className="progress" style={{ height: "2px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              aria-valuenow={(currentStep / (steps.length - 1)) * 100}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          <div className="d-flex justify-content-between">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`tracking-step ${
                  index <= currentStep ? "active" : ""
                }`}
                style={{ width: "20px" }}
              >
                <div
                  className={`step-indicator ${
                    index <= currentStep ? "bg-success" : "bg-secondary"
                  }`}
                >
                  <i className="bi bi-check"></i>
                </div>
                <small className="step-label">{step}</small>
                {index === currentStep && (
                  <small className="text-muted d-block">
                    {new Date(
                      index === 0 ? createdAt : updatedAt
                    ).toLocaleDateString()}
                  </small>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderTracking;
