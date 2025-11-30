import { createContext, useContext, useEffect, useState } from "react";

const CheckoutFlowContext = createContext(null);

const INITIAL_STATE = {
  envio: {
    nombre: "",
    apellido: "",
    ciudad: "",
    departamento: "",
    direccion: "",
    postal: "",
    telefono: "",
    notas: "",
    envio: "express", // mantiene el mismo nombre que tu form
  },
  pago: {
    metodo: "",       // "qr" | "card"
    cardName: "",
    cardNumber: "",
    cardExp: "",
    cardCvc: "",
  },
};

export function CheckoutFlowProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = sessionStorage.getItem("checkout_flow");
      return saved ? JSON.parse(saved) : INITIAL_STATE;
    } catch {
      return INITIAL_STATE;
    }
  });

  useEffect(() => {
    sessionStorage.setItem("checkout_flow", JSON.stringify(state));
  }, [state]);

  const setEnvio = (data) =>
    setState((prev) => ({ ...prev, envio: { ...prev.envio, ...data } }));

  const setPago = (data) =>
    setState((prev) => ({ ...prev, pago: { ...prev.pago, ...data } }));

  const resetFlow = () => setState(INITIAL_STATE);

  return (
    <CheckoutFlowContext.Provider value={{ state, setEnvio, setPago, resetFlow }}>
      {children}
    </CheckoutFlowContext.Provider>
  );
}

export const useCheckoutFlow = () => useContext(CheckoutFlowContext);
