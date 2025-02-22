import { useCallback, useEffect, useState } from "react";

export function useTimer(initialTime: number) {
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (!isRunning || remainingTime <= 0) {
            setIsRunning(false);
            return;
        }

        const interval = setInterval(() => {
            setRemainingTime((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, remainingTime]);

    const startTimer = useCallback(() => {
        setRemainingTime(initialTime);
        setIsRunning(true);
    }, [initialTime]);

    const formattedTime = formatTime(remainingTime);

    return { time: formattedTime, startTimer, isRunning };
}

function formatTime(sec: number) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;

    const time = new Intl.NumberFormat("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
    });

    return `${time.format(minutes)}:${time.format(seconds)}`
}
