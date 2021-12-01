import {useEffect, useContext} from 'react';

import GameContext from '../../../store/GameContext';
import useTitle from '../../../hooks/useTitle'

import styles from './Playground.module.css';

/**
 * Initialise et gère via le contexte les scores de la partie
 * @returns Container des scores de la partie en cours
 */
const Scores = () => {
    const {playerLeft, setPlayerLeft, playerRight, setPlayerRight} = useContext(GameContext);
    useTitle(`${playerLeft.name} vs. ${playerRight.name}`)

    //Mise à 0 des scores au montage du composants
    useEffect(() => {
        setPlayerLeft({...playerLeft, score: 0});
        setPlayerRight({...playerRight, score: 0});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.scores}>
            <div className={styles.score}>Score de {playerLeft.name} : <em>{playerLeft.score}</em></div>
            <div className={styles.score}>Score de {playerRight.name} : <em>{playerRight.score}</em></div>
        </div>
    );
};

export default Scores;