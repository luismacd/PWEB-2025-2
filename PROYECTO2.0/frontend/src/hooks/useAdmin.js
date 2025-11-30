import useAuth from "./useAuth";

export default function useAdmin() {
  const auth = useAuth();
  return {
    isAdmin: !!(auth && (auth.user?.role === "admin" || auth.user?.tipoUsuario === "admin")),
    user: auth?.user || null,
  };
}
