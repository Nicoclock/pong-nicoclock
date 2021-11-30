import {useState, useEffect} from 'react';

const defaultSize = {
    width: '0px', 
    height: '0px'
};

const useResize = ref => {
    const [size, setSize] = useState({...defaultSize});

    useEffect(() => {
        const resize = () => {
            if (ref.current) {
                const ground = ref.current.getBoundingClientRect();
                const ratio = 0.6;
                const step = 0.05;
                let start = 0.95;
                let fit = false;
                let width;
                let height;
                while (!fit) {
                    width = ground.width * start;
                    height = width * ratio;
                    if (ground.width > ground.height) {
                        height = ground.height * start;
                        width = height / ratio;
                    }
                    if (width <= ground.width && height <= ground.height)
                        fit = true;
                    else
                        start -= step;
                }
                setSize({width, height});
            }
        }
        window.addEventListener('resize', () => resize(), {passive: true});
        resize();
        return () => window.removeEventListener('resize', resize);
    }, [ref]);
    return size;
}

export default useResize;