import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`card shadow-sm p-4 ${className}`}>{children}</div>;
};

export default Card;
