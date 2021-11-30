import {useEffect, useContext} from 'react';

import GameContext from '../../../store/GameContext';
import useTitle from '../../../hooks/useTitle'

import styles from './Playground.module.css';

const Scores = () => {
    const {playerLeft, setPlayerLeft, playerRight, setPlayerRight} = useContext(GameContext);
    useTitle(`${playerLeft.name} vs. ${playerRight.name}`)

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