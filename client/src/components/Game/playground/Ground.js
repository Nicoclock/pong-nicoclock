import {useRef} from 'react';

import useDevices from '../../../hooks/useDevices';
import useLoop from '../../../hooks/useLoop';
import useResize from '../../../hooks/useResize';
import useBallLoop from '../../../hooks/useBallLoop';

import styles from './Playground.module.css';

/**
 * Déclare les références pour la gestion des éléments dans la boucle d'animation
 * @returns {JSX} Le terrain et les éléments de jeu
 */
const Ground = () => {
    const groundRef = useRef();
    const fieldRef = useRef();
    const leftRef = useRef();
    const rightRef = useRef();
    const ballRef = useRef();

    //dimensions du terrain
    const size = useResize(groundRef);
    //événements et fonctions de gestion des devices sélectionnés
    useDevices(fieldRef, leftRef, rightRef);
    //gestion des éléments du jeu
    useBallLoop(ballRef, leftRef, rightRef, fieldRef);
    //lancement de la boucle d'animation
    useLoop();

    return (
        <div ref={groundRef} className={styles.ground}>
            <div ref={fieldRef} className={styles.field} style={size}>
                <div className={styles.net} />
                <div ref={leftRef} className={styles.player} style={{left: '5%'}}/>
                <div ref={rightRef} className={styles.player} style={{right: '5%'}}/>
                <div ref={ballRef} className={styles.ball} />
            </div>
        </div>
    );
};

export default Ground;
