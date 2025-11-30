import { useContext } from "react";
import OrderContext from "../components/context/OrderContext";

export default function useOrders() {
  return useContext(OrderContext);
}
