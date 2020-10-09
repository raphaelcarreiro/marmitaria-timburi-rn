import React, { useState, useContext, useCallback } from 'react';
import { ThemeProvider } from '../styled-components';
import { DefaultTheme } from 'styled-components/native';
import Color from 'color';

export function createTheme(primary: string, secondary: string): DefaultTheme {
  const primaryColor = Color(primary);
  const secondaryColor = Color(secondary);

  const primaryContrast =
    primaryColor.red() * 0.299 + primaryColor.green() * 0.587 + primaryColor.blue() * 0.114 > 186 ? '#222' : '#fafafa';

  const secondaryContrast =
    secondaryColor.red() * 0.299 + secondaryColor.green() * 0.587 + secondaryColor.blue() * 0.114 > 186
      ? '#222'
      : '#fafafa';

  return {
    primary,
    secondary,
    contrast: primaryContrast,
    secondaryContrast: secondaryContrast,
    error: '#dc3545',
    primaryDark: primaryColor.darken(0.1).hex(),
    primaryLight: primaryColor.alpha(0.05).rgb().string(),
  };
}

interface ThemeContextData {
  handleSetTheme(primary: string, secondary: string): void;
}

const ThemeContext = React.createContext({} as ThemeContextData);

export function useThemeContext(): ThemeContextData {
  const context = useContext(ThemeContext);
  return context;
}

const Theme: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<DefaultTheme>(createTheme('#222', '#4b4b4d'));

  const handleSetTheme = useCallback((primary, secondary) => {
    setTheme(createTheme(primary, secondary));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ThemeContext.Provider value={{ handleSetTheme }}>{children}</ThemeContext.Provider>
    </ThemeProvider>
  );
};

export default Theme;
