import { useTheme } from "../hook/useTheme"

export default function Home() {
    const { toggleTheme, theme } = useTheme();

    return (
        <div>
            <button onClick={toggleTheme}>{theme}</button>
        </div>
    )
}