// Compatibility shim: the real implementation moved to `src/context/AuthContext.jsx`
// Re-export with the legacy names expected by components (`UserProvider`, `useUser`).
export { AuthProvider as UserProvider, useAuth as useUser } from "../../context/AuthContext";
