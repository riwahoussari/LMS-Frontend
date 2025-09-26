import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed z-100 bottom-6 right-6">
      <Button
        variant="outline"
        className="bg-background!"
        size="icon"
        onClick={() => {
          if (theme === "dark") setTheme("light");
          else if (theme === "light") setTheme("dark");
          else {
            setTheme(
              window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "light"
                : "dark"
            );
          }
        }}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}