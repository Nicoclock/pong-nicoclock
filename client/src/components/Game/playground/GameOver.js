import {useContext} from 'react';

import GameContext from '../../../store/GameContext';
import useTitle from '../../../hooks/useTitle'

import styles from './Playground.module.css';

/**
 * Indique les scores, le gagnant et propose de refaire une partie ou de relancer la configuration
 * @returns {JSX} Page de fin de partie
 */
const GameOver = () => {
    useTitle('Partie terminée')
    const {resetGame, resetPlayers, playerLeft, playerRight} = useContext(GameContext);
    const winner = playerLeft.score === 11 ? playerLeft.name : playerRight.name;
    return (
        <div className="main">
            <h1>Résultats</h1>
            <div className={styles.resultats}>
                <div className={styles.resultat}>{playerLeft.name} : {playerLeft.score}</div>
                <div className={styles.resultat}>{playerRight.name} : {playerRight.score}</div>
            </div>
            <h2 className={styles.winner}>Bravo {winner} !!</h2>
            <div className={styles.endGame}>
                <div className={styles.gameLink} onClick={resetGame}>Refaire une partie</div>
                <div className={styles.gameLink} onClick={resetPlayers}>Configurer une nouvelle partie</div>
            </div>
        </div>
    );
};

export default GameOver;
