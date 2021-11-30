import { useEffect } from "react"

const useAutoscroll = (appRef, gameRef) => {
    useEffect(() => {
        appRef.current.scroll(0, 10000);
    })
}

export default useAutoscroll;