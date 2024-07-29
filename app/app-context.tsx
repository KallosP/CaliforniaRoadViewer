import React, { createContext, useState, useContext } from 'react';

interface AppContextType {
  isCamChecked: boolean;
  setCamChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultContextValue: AppContextType = {
  isCamChecked: false,
  setCamChecked: () => {},
};
const AppContext = createContext<AppContextType>(defaultContextValue);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isCamChecked, setCamChecked] = useState(false);
  return (
    <AppContext.Provider value={{
      isCamChecked, setCamChecked,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);