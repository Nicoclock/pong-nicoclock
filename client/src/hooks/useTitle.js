import {useEffect} from 'react';

const useTitle = title => {
    useEffect(() => {
        document.title = `Pong - ${title}`;
    }, [title]);
}
export default useTitle;