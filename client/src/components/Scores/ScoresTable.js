import SortableTh from './SortableTh';

import styles from './ScoresTable.module.css';

/**
 * Présentation des scores sauvegardés
 * Le tri est descendant par défaut pour les dates, ascendant par défaut pour les autres champs
 * Le switch s'effectue en cliquant sur le header de la colonne
 * @param {object} props 
 * @returns {JSX} Tableau des scores triable par colonnes
 */
const ScoresTable = ({scores, sortBy, onClick}) => {
    const sortables = ['date', 'joueur1', 'joueur2', 'adversaire', 'score1', 'score2'];
    const keys = ['date', 'joueur', 'joueur1', 'score1', 'adversaire', 'joueur2', 'score2'];

    const dateOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }

    return (
        <table role="table">
            <thead>
                <tr role="row">
                    {keys.map(key => {        
                        if (scores[0][key] !== undefined) {
                            if (sortables.includes(key) && scores.length > 1)
                                return <SortableTh key={key} className={styles.sortable} sortBy={sortBy} onClick={onClick}>{key}</SortableTh>
                            return <th key={key} role="columnheader">{key}</th>
                        }
                        return null;
                    })}
                </tr>
            </thead>
            <tbody>
                {scores.map(score => <tr key={score.game_id} role="row">
                    {keys.map((key, index) => {
                        if (key === 'date') {
                            const date = new Date(score[key]).toLocaleString('fr-FR', dateOptions);
                            return <td key={index} role="cell">{date}</td>
                        }
                        return score[key] !== undefined && <td key={index} role="cell">{score[key]}</td>
                    })}
                </tr>)}
            </tbody>
        </table>
    );
};

export default ScoresTable;