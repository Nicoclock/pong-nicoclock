import {useEffect, useContext} from 'react';

import GameContext from '../store/GameContext';

const useLoop = () => {

    const {loopFunctions} = useContext(GameContext);

    useEffect(() => {
        //boucle d'animation globale
        const loop = () => {
            for (const name in loopFunctions) 
                loopFunctions[name]();
            result = requestAnimationFrame(loop);
        }
        let result = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(result);
    }, [loopFunctions]);
}

export default useLoop;