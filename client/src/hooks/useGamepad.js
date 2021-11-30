import { useEffect, useState } from "react"

const useGamepad = () => {
    const [gamepads, setGamepads] = useState(navigator.getGamepads() || navigator.webkitGetGamepads());

    const updateGamepads = () => setGamepads(navigator.getGamepads() || navigator.webkitGetGamepads());
    useEffect(() => {
        window.addEventListener('gamepadconnected', updateGamepads);
        window.addEventListener('gamepaddisconnected', updateGamepads);
        return () => {
            window.removeEventListener('gamepadconnected', updateGamepads);
            window.removeEventListener('gamepaddisconnected', updateGamepads);
        }
    }, []);
    return gamepads;
};

export default useGamepad;