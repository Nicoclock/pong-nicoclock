import {useContext, forwardRef} from 'react';

import GameContext from '../../../store/GameContext';
import PlayerConfig from './PlayerConfig';
import useTitle from '../../../hooks/useTitle';
import useGamepad from '../../../hooks/useGamepad';
import useAutoscroll from '../../../hooks/useAutoscroll';

import styles from '../Game.module.css';


const GameConfig = forwardRef(({appRef, setReady}, ref) => {
    useTitle('Configuration des joueurs');
    useAutoscroll(appRef, ref);
    const {playerLeft, setPlayerLeft, playerRight, setPlayerRight} = useContext(GameContext);

    const withGamepad = (playerLeft && playerLeft.device && playerLeft.device === 'gamepad') || 
    (playerRight && playerRight.device && playerRight.device === 'gamepad');

    const validConfig = (
        playerLeft && playerLeft.device && (playerLeft.deviceIndex !== undefined || playerLeft.up)
    ) && (
        playerRight && playerRight.device && (playerRight.deviceIndex !== undefined || playerRight.up)
    );
    const gamepads = useGamepad();
    return (
        <div className="main" ref={ref}>
            <h1>Nouvelle partie</h1>
            <section>
                <div className={styles.gameConfig}>
                    <PlayerConfig player={playerLeft} other={playerRight} position="gauche" label2="(haut: a, bas: q)" 
                        setPlayer={setPlayerLeft} gamepads={gamepads} keyboard={{up: 'a', down: 'q'}}/>
                    <PlayerConfig player={playerRight} other={playerLeft} position="droite" label2="(haut: flèche haut, bas: flèche bas)" 
                        setPlayer={setPlayerRight} gamepads={gamepads} keyboard={{up: 'ArrowUp', down: 'ArrowDown'}} />
                </div>
                {withGamepad && <p className={styles.warning}>Si votre gamepad n'apparait pas dans la liste, appuyez sur un de ses boutons/contrôles</p>}
                {validConfig && <div className={styles['launch']}><button onClick={setReady}>Démarrer la partie</button></div>}
            </section>
        </div>
    );
});

export default GameConfig;