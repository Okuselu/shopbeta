//src/pages/DashboardPage.tsx
import React, { useContext } from "react";
import { AuthContext, AuthProvider } from "../context/authContext/authContext";

const DashboardPage: React.FC = () => {
  const { state } = useContext(AuthContext);

  //   console.log(state);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {state.user?.username}! Manage your platform here.</p>
    </div>
  );
};

export default DashboardPage;
