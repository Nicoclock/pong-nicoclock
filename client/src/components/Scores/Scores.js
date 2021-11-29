import {useState} from 'react';

import useTitle from '../../hooks/useTitle';
import useFetch from '../../hooks/useFetch';
import PlayerSelect from '../common/PlayerSelect/PlayerSelect';
import ScoresTable from './ScoresTable';

import styles from './Scores.module.css';

const defaultState = {
    url: '/scores',
    sortBy: 'date', 
    sortDir: 'DESC'
}

const Scores = props => {
    useTitle('Scores');
    const [state, setState] = useState({...defaultState});
    const sortedUrl = () => `${state.url}?sortBy=${state.sortBy}&sortDir=${state.sortDir}`;

//    const [url, setUrl] = useState(sortedUrl('/scores'));
    const [error, scores] = useFetch(sortedUrl());


    const changeHandler = event => {
        if (event.target.value)
            setState({...defaultState, url: `/scores/${event.target.value}`});
        else
            setState({...defaultState});
    }

    const sortHandler = event => {
        if (event.target.textContent === state.sortBy)
            setState(oldState => ({...oldState, sortDir: oldState.sortDir === 'ASC' ? 'DESC' : 'ASC'}))
        else
            setState(oldState => ({...oldState, sortBy: event.target.textContent, sortDir: 'ASC'}));
//        setUrl(sortedUrl(url));
    }

    return (
        <main className="main">
            <h1>Afficher les scores de <PlayerSelect className="title" all={true} onChange={changeHandler} /></h1>
            <div className={styles.content}>
                {scores && scores.length ? <ScoresTable scores={scores} sortBy={state.sortBy} onClick={sortHandler}/> : <div className="error">Aucun score à afficher ...</div>}
                {error && <div key="error" className="error">{error}</div>}
            </div>
        </main>
    )
}

export default Scores;