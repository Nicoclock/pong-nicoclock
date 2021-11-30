import {useContext} from 'react';

import GameContext from '../../../store/GameContext';
import Scores from './Scores';
import Ground from './Ground';

import styles from './Playground.module.css';

const Playground = () => {
    const {gameOver, resetGame, resetPlayers} = useContext(GameContext);
    if (gameOver) {
        return <div className={styles.endGame}>
            <div className={styles.gameLink} onClick={resetGame}>Refaire une partie</div>
            <div className={styles.gameLink} onClick={resetPlayers}>Configure une nouvelle partie</div>

        </div>
    }
    return (
        <div className={`main ${styles.playground}`}>
            <Scores />
            <Ground />
        </div>
    );
};

export default Playground;