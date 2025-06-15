import { getToken } from "../utils/auth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" />;
}
