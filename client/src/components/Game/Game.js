import {useContext, forwardRef} from 'react';

import GameContext from '../../store/GameContext';
import GameConfig from './config/GameConfig';
import Playground from './playground/Playground';

const Game = forwardRef(({appRef}, ref) => {
    const {ready, setReady} = useContext(GameContext);

    return (
        <>    
            {!ready ? 
                <GameConfig appRef={appRef} ref={ref} setReady={setReady}/>
            : 
                <Playground />
            }
        </>
    )
});

export default Game;