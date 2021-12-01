import { useEffect } from "react"

//déclenchement du scroll lors de l'update du formulaire de config du jeu
const useAutoscroll = (appRef, gameRef) => {
    useEffect(() => {
        appRef.current.scroll(0, 10000);
    })
}

export default useAutoscroll;