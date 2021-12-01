import {useEffect, useContext} from 'react';

import GameContext from '../store/GameContext';

const useBallLoop = (ballRef, leftRef, rightRef, fieldRef) => {
    const {addLoopFunction, removeLoopFunction, playerLeft, setPlayerLeft, playerRight, setPlayerRight, closeGame} = useContext(GameContext);

    /**
     * Initialise la position, vitesse et direction de la balle au début de chaque round
     * @param {DOMElement} ball 
     * @param {object} fieldRect - Bounding box du terrain
     */
    const initBall = (ball, fieldRect) => {
        ball.style.display = 'none';
        //position de départ
        const top = fieldRect.height * Math.random()*0.2;
        const left = fieldRect.width*0.4 + fieldRect.width*Math.random()*0.2;
        ball.style.top = top + 'px';
        ball.style.left = left + 'px';
        
        //direction de départ
        ball.direction = {x: left <= fieldRect.width/2 ? 1 : -1, y: 0.75 - Math.random()*1.5};

        //vitesse de départ
        ball.speed = fieldRect.width*0.005 + (playerLeft.score + playerRight.score)*0.05;
        ball.style.display = 'block';
    }

    /**
     * 
     * @param {DOMElement} ball 
     * @param {object} ballRect - Bounding box de la balle
     * @param {DOMElement} rect - Raquette 
     * @param {object} fieldRect - Bounding box de la raquette
     * @returns {boolean}
     */
    const didCollide = (ball, ballRect, rect, fieldRect) => {
        const ballTop = parseInt(ball.style.top);
        const middle = fieldRect.height / 2;
        const topMin = rect.top-fieldRect.top;
        const topMax = rect.top-fieldRect.top+rect.height;
        const ballCenter = ballTop + ballRect.height / 2;
        //console.log('ballCenter', ballCenter, 'topMin', topMin, 'topMax', topMax, 'middle', middle);
        if (ballTop + ballRect.height >= rect.top-fieldRect.top && ballTop <= rect.top-fieldRect.top+rect.height) {
            let ratio = Math.min(((ballTop-topMin)/(topMax-topMin)-0.5) * 2, 1);
            if (ballCenter <= middle)
                ratio = Math.max(((ballCenter-topMin)/(topMax-topMin)-0.5) * 2, -1);
            ball.direction.y = 0.75 * ratio;
            return true;
        }
    }

    const ballLoop = () => {
        if (playerLeft.score === 11 || playerRight.score === 11)
            //déclenche la fin de partie via le contexte
            return closeGame();

        const fieldRect = fieldRef.current.getBoundingClientRect();
        const leftRect = leftRef.current.getBoundingClientRect();
        const rightRect = rightRef.current.getBoundingClientRect();
        const ball = ballRef.current;
        const ballRect = ball.getBoundingClientRect();

        //si la balle est en mouvement
        if (ball.speed > 0) {
            //on met à jour sa position en fonction de sa direction et de la vitesse
            const top = parseInt(ball.style.top) + ball.direction.y*ball.speed;
            const left = parseInt(ball.style.left) + ball.direction.x*ball.speed;
            ball.style.top = top + 'px';
            ball.style.left = left + 'px';
    
            const topMin = 0;
            const topMax = fieldRect.height-ballRect.height;
            const leftMin = leftRect.left+leftRect.width-fieldRect.left;
            const leftMax = rightRect.left-ballRect.width-fieldRect.left;

            // gestion des collisions horizontales
            if (left <= leftMin) {
                if (left >= leftRect.left-fieldRect.left && didCollide(ball, ballRect, leftRect, fieldRect))
                    //collision avec la raquette de gauche
                    ball.direction.x = -ball.direction.x;
                else if (left < -ballRect.width) {
                    //sortie de terrain à gauche, le joueur de droite marque le point
                    ball.speed = 0;
                    setPlayerRight(oldState => ({...playerRight, score: oldState.score+1}));
                }
            }
            if (left >= leftMax) {
                if (left <= rightRect.left-fieldRect.left+rightRect.width && didCollide(ball, ballRect, rightRect, fieldRect))
                //collision avec la raquette de droite
                    ball.direction.x = -ball.direction.x;
                else if (left > fieldRect.width) {
                    ball.speed = 0;
                    //sortie de terrain à droite, le joueur de gauche marque le point
                    setPlayerLeft(oldState => ({...playerLeft, score: oldState.score+1}));
                }
            }
            // gestion des collisions verticales
            if ((top <= topMin && ball.direction.y < 0) || (top >= topMax && ball.direction.y > 0))
                ball.direction.y = -ball.direction.y;
        }

    }

    
    useEffect(() => {
        let timeout;
        if (fieldRef) {
            const fieldRect = fieldRef.current.getBoundingClientRect();
            //à la première exécution, les dimensions du terrain sont incorrectes
            //on attend la 2ème exécution pour enregistrer la fonction d'animation
            if (fieldRect.width > 2) {
                addLoopFunction('ballLoop', ballLoop);
                //délai en début de partie et entre chaque round avant le lancement de la balle
                timeout = setTimeout(() => initBall(ballRef.current, fieldRect), 1000)
            }
        }
        return () => {
            clearTimeout(timeout);
            removeLoopFunction('ballLoop');
        }
    });
};

export default useBallLoop;