import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || null);
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || null);
  const [user, setUser] = useState(() => localStorage.getItem("user") || null);
  const [userRole, setUserRole] = useState(() => localStorage.getItem("userRole") || null);
  const [userProfile, setUserProfile] = useState(() => localStorage.getItem("userProfile") || null);

  useEffect(() => {
    localStorage.setItem("userName", userName);
    localStorage.setItem("userId", userId);
    localStorage.setItem("user", user);
    localStorage.setItem("userRole", userRole);
    localStorage.setItem("userProfile", userProfile);
  }, [userName, userId, user, userRole, userProfile]);

  const signout = () => {
    localStorage.clear();
    setUserName(null);
    setUserId(null);
    setUser(null);
    setUserRole(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userName,
        setUserName,
        userId,
        setUserId,
        user,
        setUser,
        userRole,
        setUserRole,
        userProfile,
        setUserProfile,
        signout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const RequireAuth = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={{ pathname: "/unauthorized", state: { from: location } }} replace />;
  }

  return <Outlet />;
};
