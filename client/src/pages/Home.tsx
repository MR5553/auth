import { Button } from "../components/Button";
import { useTheme } from "../hook/useTheme"

export default function Home() {
    const { toggleTheme, theme } = useTheme();

    return (
        <div>
            <Button variant="defualt" size="sm" onClick={toggleTheme}>{theme}</Button>
        </div>
    )
}