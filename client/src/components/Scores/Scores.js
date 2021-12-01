import useTitle from '../../hooks/useTitle';
import useFetch from '../../hooks/useFetch';
import useSort from '../../hooks/useSort';
import PlayerSelect from '../common/PlayerSelect/PlayerSelect';
import ScoresTable from './ScoresTable';

import styles from './Scores.module.css';

/**
 * Affichage des scores pour tous les joueurs ou pour un joueur spécifique
 * @returns {JSX} Container de l'affichage des scores
 */
const Scores = () => {
    useTitle('Scores');

    //logique de tri des data 
    const [state, changeHandler, sortHandler] = useSort();

    //utilitaire pour ajouter les variables de tri
    const sortedUrl = () => `${state.url}?sortBy=${state.sortBy}&sortDir=${state.sortDir}`;

    //récupération des data
    const [error, scores] = useFetch(sortedUrl());

    return (
        <main className="main">
            <h1>Afficher les scores de <PlayerSelect className="title" all={true} onChange={changeHandler} value={state.userId}/></h1>
            <section className={styles.content}>
                {scores && scores.length ? <ScoresTable scores={scores} sortBy={state.sortBy} onClick={sortHandler}/> : <div className="error">Aucun score à afficher ...</div>}
                {error && <div key="error" className="error">{error}</div>}
            </section>
        </main>
    )
}

export default Scores;