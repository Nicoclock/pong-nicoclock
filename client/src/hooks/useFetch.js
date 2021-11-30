import {useState, useEffect, useContext} from 'react';
import env from 'react-dotenv';

import GameContext from '../store/GameContext';

const useFetch = url => {
    const [data, setData] = useState([]);
    const [error, setError] = useState();
    const {players, setPlayers} = useContext(GameContext);

    useEffect(() => {
        if (url === '/players' && players  && players.length) {
            setData(players);
        } else {
            (async () => {
                //console.log('fetching', env.API_URL+url)
                try {
                    const result = await fetch(`${env.API_URL}${url}`);
                    const json = await result.json();
                    if (url === '/players')
                        setPlayers(json)
                    else {
                        if (result.ok) {
                            setData(json);
                        } else {
                            setError(json);
                        }
                    }
                } catch(error) {
                    console.log(error);
                }
            })();
    
        }
    }, [url, players, setPlayers]);
    return [error, data];
    
};

export default useFetch;
