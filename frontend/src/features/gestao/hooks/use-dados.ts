import { useContext } from "react";
import { DataContext } from "../context/data-context";

export function useDados() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useDados deve ser usado dentro de DataProvider");
  return context;
}
