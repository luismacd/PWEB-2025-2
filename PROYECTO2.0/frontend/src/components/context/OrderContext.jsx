import { createContext, useContext, useEffect, useMemo, useState } from "react";

const OrderContext = createContext(null);
const LS_KEY = "ordenesCompletadas";

export function OrderProvider({ children }) {
  // Cargar órdenes guardadas
  const [ordenes, setOrdenes] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(ordenes));
  }, [ordenes]);

  const guardarOrden = (order) => {
    const id = Date.now();            
    const nueva = { id, ...order };  
    setOrdenes((prev) => [...prev, nueva]);
    return id;
  };

  const value = useMemo(
    () => ({ ordenes, guardarOrden }),
    [ordenes]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders debe usarse dentro de <OrderProvider>");
  return ctx;
};
