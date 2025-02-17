// src/components/AuthForm.tsx
import React from "react";
import { AuthFormProps } from "../../types/authForm.types";
const AuthForm: React.FC<AuthFormProps> = ({ title, onSubmit, children }) => {
  return (
    <div>
      <h1>{title}</h1>
      <form onSubmit={onSubmit}>
        {children}
        <button type="submit">{title}</button>
      </form>
    </div>
  );
};

export default AuthForm;
