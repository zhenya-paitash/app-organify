"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeButton() {
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const [mounted, setMounted] = React.useState(false);

  // После монтирования компонента устанавливаем mounted в true
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Предотвращаем ошибку гидратации, не рендеря иконки до монтирования
  const renderIcon = () => {
    if (!mounted) return null;
    return theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />;
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="relative w-12 h-8 p-1 rounded-md border-none bg-primary/10 hover:bg-primary/15">
      <div className="absolute top-1 left-1 w-6 h-6 rounded-sm shadow flex items-center justify-center transition-all duration-300 bg-accent text-primary translate-x-0 dark:translate-x-4">
        {renderIcon()}
      </div>
    </Button>
  );
}

