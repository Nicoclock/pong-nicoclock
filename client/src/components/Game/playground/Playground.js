import {useContext} from 'react';

import GameContext from '../../../store/GameContext';
import GameOver from './GameOver';
import Scores from './Scores';
import Ground from './Ground';

import styles from './Playground.module.css';

/**
 * Container de éléments de la partie
 * @returns {JSX} Le terrain de jeu ou la page de fin
 */
const Playground = () => {
    const {gameOver} = useContext(GameContext);

    if (gameOver)
        return <GameOver />

    return (
        <div className={`main ${styles.playground}`}>
            <Scores />
            <Ground />
        </div>
    );
};

export default Playground;