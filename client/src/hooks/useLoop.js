import {useEffect, useContext} from 'react';

import GameContext from '../store/GameContext';


const useLoop = () => {

    const {loopFunctions} = useContext(GameContext);


    useEffect(() => {
        let start = 0;
        const loop = (elapsed) => {
            const delta = elapsed - start;
            start = elapsed;
            for (const name in loopFunctions) 
                loopFunctions[name](elapsed, delta);
            result = requestAnimationFrame(loop);
        }
        let result = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(result);
    }, [loopFunctions]);
}

export default useLoop;