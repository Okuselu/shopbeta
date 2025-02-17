import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children, className = '', narrow }) => {
  return (
    <div className={`container py-4 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
