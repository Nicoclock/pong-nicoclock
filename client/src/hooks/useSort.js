import {useState} from 'react';

const defaultState = {
    userId: null,
    url: '/scores',
    sortBy: 'date', 
    sortDir: 'DESC'
}

const useSort = () => {
    const [state, setState] = useState({...defaultState});

    //changement de colonne à trier
    const changeHandler = event => {
        if (event.target.value)
            setState({...defaultState, url: `/scores/${event.target.value}`, userId: event.target.value});
        else
            setState({...defaultState});
    }

    //changement de l'ordre d'une colonne
    const sortHandler = event => {
        if (event.target.textContent === state.sortBy)
            setState(oldState => ({...oldState, sortDir: oldState.sortDir === 'ASC' ? 'DESC' : 'ASC'}))
        else
            setState(oldState => ({...oldState, sortBy: event.target.textContent, sortDir: 'ASC'}));
    }

    return [state, changeHandler, sortHandler];

};

export default useSort;