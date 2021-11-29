import SortableTh from './SortableTh';

import styles from './ScoresTable.module.css';

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
        <table>
            <thead>
                <tr>
                    {keys.map(key => {
                        if (scores[0][key]) {
                            if (sortables.includes(key) && scores.length > 1)
                                return <SortableTh key={key} className={styles.sortable} sortBy={sortBy} onClick={onClick}>{key}</SortableTh>
                            return <th key={key}>{key}</th>
                        }
                        return null;
                    })}
                </tr>
            </thead>
            <tbody>
                {scores.map(score => <tr key={score.game_id}>
                    {keys.map((key, index) => {
                        if (key === 'date') {
                            const date = new Date(score[key]).toLocaleString('fr-FR', dateOptions);
                            return <td key={index}>{date}</td>
                        }
                        return score[key] && <td key={index}>{score[key]}</td>
                    })}
                </tr>)}
            </tbody>
        </table>
    );
};

export default ScoresTable;