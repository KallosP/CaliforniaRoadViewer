import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {Appearance, useColorScheme} from 'react-native'

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleTheme = () => setIsDarkMode(prevMode => !prevMode);

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (colorScheme === 'dark') {
      setIsDarkMode(true);
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
