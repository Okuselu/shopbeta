import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext/authContext";
import Container from "../components/UI/Container";
import Spinner from "../components/UI/Spinner";
import Alert from "../components/UI/Alert";

interface User {
  _id: string;
  email: string;
  username: string;
  roles: string[];
  createdAt: string;
}

const AdminUsers: React.FC = () => {
  const { state } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/users/all", {
          headers: {
            Authorization: `Bearer ${state.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.data) {
          setUsers(response.data.data);
        } else {
          throw new Error("No users data received");
        }
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    if (state.token) {
      fetchUsers();
    }
  }, [state.token]);

  const updateUserRole = async (userId: string, role: string, action: "add" | "remove") => {
    try {
      const response = await axios.patch(
        `http://localhost:5050/api/users/${userId}/roles`,
        { role, action },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setUsers(users.map((user) => {
          if (user._id === userId) {
            const newRoles = action === "add"
              ? [...user.roles, role]
              : user.roles.filter((r) => r !== role);
            return { ...user, roles: newRoles };
          }
          return user;
        }));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user role");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert type="danger" message={error} />;

  return (
    <Container>
      <h1 className="mb-4">User Management</h1>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {user.roles.map((role) => (
                    <span key={role} className="badge bg-primary me-1">
                      {role}
                    </span>
                  ))}
                </td>
                <td>
                  <div className="btn-group">
                    {!user.roles.includes("admin") && (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => updateUserRole(user._id, "admin", "add")}
                      >
                        Make Admin
                      </button>
                    )}
                    {user.roles.includes("admin") && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          updateUserRole(user._id, "admin", "remove")
                        }
                      >
                        Remove Admin
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default AdminUsers;
