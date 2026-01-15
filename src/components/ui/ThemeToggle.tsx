import { Sun, Moon } from "lucide-react";
import { useUserContext } from "../../providers/UserProvider";

export default function ThemeToggle() {
    const { user_profile, setTheme } = useUserContext();
    const isDark = user_profile?.settings?.theme === "dark";

    const toggle = () => setTheme(isDark ? "light" : "dark");

    return (
        <button
            onClick={toggle}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle theme"
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
