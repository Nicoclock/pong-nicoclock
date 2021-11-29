import {useState, useEffect} from 'react';
import env from 'react-dotenv';

const useFetch = url => {
    const [data, setData] = useState([]);
    const [error, setError] = useState();


    useEffect(() => {
        (async () => {
            console.log('fetching', env.API_URL+url)
            try {
                const result = await fetch(`${env.API_URL}${url}`);
                const json = await result.json();
                if (result.ok) {
                    setData(json);
                } else {
                    setError(json);
                }
            } catch(error) {
                console.log(error);
            }
        })();
    }, [url]);
    return [error, data];
    
};

export default useFetch;
