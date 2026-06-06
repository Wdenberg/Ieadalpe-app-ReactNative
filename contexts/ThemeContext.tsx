import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";

// 1. Definição dos tokens com inferência estrita de tipos
const themeTokens = {
  primary: { light: "#03318C", dark: "#03318C" },
  secondary: { light: "#023E73", dark: "#023E73" },
  tertiary: { light: "#02730A", dark: "#02730A" },
  action: { light: "#024959", dark: "#02730A" },
  background: { light: "#F2F2F2", dark: "#011F4B" },
  surface: { light: "#FFFFFF", dark: "#023E73" },
  foreground: { light: "#024959", dark: "#F2F2F2" },
  muted: { light: "#023E7399", dark: "#F2F2F2B3" },
  border: { light: "#03318C", dark: "#02730A" },
  success: { light: "#02730A", dark: "#02730A" },
  warning: { light: "#024959", dark: "#024959" },
  error: { light: "#7A2E2E", dark: "#D97070" },
} as const; // "as const" garante que o TS leia os valores literais, não apenas strings genéricas

// 2. Tipagens extraídas automaticamente dos tokens
type ThemeMode = "light" | "dark";
export type ThemeColors = {
  -readonly [K in keyof typeof themeTokens]: string;
};

// Interface do que o Contexto vai entregar para os componentes
interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

// Inicializa o contexto (pode ser undefined antes do Provider carregar)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(systemScheme === "dark");

  useEffect(() => {
    setIsDark(systemScheme === "dark");
  }, [systemScheme]);

  const currentTheme: ThemeMode = isDark ? "dark" : "light";

  // Mapeia e tipa as cores baseadas no tema atual
  const colors = Object.keys(themeTokens).reduce((acc, key) => {
    const tokenKey = key as keyof typeof themeTokens;
    acc[tokenKey] = themeTokens[tokenKey][currentTheme];
    return acc;
  }, {} as ThemeColors);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Hook customizado com validação de segurança do TypeScript
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }

  return context;
};
