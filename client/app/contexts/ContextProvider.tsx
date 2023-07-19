import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";

const initialState = {
  pathname: "/",
  activeMenu: true,
};

const StateContext = createContext(initialState);

export const ContextProvider = ({ children }: any) => {
  const [activeMenu, setActiveMenu] = useState<boolean>(true);
  const pathname = "/";
  return (
    <StateContext.Provider
      value={{
        activeMenu,
        pathname,
      }}
    ></StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
