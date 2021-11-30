import {useEffect, useContext, useState} from 'react';

import GameContext from '../store/GameContext';

const useBallLoop = (ballRef, leftRef, rightRef, fieldRef) => {
    const {addLoopFunction, removeLoopFunction, playerLeft, setPlayerLeft, playerRight, setPlayerRight, closeGame} = useContext(GameContext);

    const [gameOver, setGameover] = useState(false);

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

    const isGameOver = () => playerLeft.score === 11 || playerRight.score === 11;

    const ballLoop = () => {
        if (isGameOver())
            return closeGame();

        const fieldRect = fieldRef.current.getBoundingClientRect();
        const leftRect = leftRef.current.getBoundingClientRect();
        const rightRect = rightRef.current.getBoundingClientRect();
        const ball = ballRef.current;
        const ballRect = ball.getBoundingClientRect();
        if (ball.speed > 0) {
            const top = parseInt(ball.style.top) + ball.direction.y*ball.speed;
            const left = parseInt(ball.style.left) + ball.direction.x*ball.speed;
            ball.style.top = top + 'px';
            ball.style.left = left + 'px';
            //console.log(ball.direction.x*ball.speed, top, left);
    
            const topMin = 0;
            const topMax = fieldRect.height-ballRect.height;
            const leftMin = leftRect.left+leftRect.width-fieldRect.left;
            const leftMax = rightRect.left-ballRect.width-fieldRect.left;
            //console.log('top', top, 'topMin', topMin, 'topMax', topMax);

            // gestion des collisions verticales
            if ((top <= topMin && ball.direction.y < 0) || (top >= topMax && ball.direction.y > 0))
                ball.direction.y = -ball.direction.y;
    
            // gestion des collisions horizontales
            if (left <= leftMin) {
                if (left >= leftRect.left-fieldRect.left && didCollide(ball, ballRect, leftRect, fieldRect))
                    ball.direction.x = -ball.direction.x;
                else if (left < -ballRect.width) {
                    ball.speed = 0;
                    setPlayerRight(oldState => ({...playerRight, score: oldState.score+1}));
                }
            }
            if (left >= leftMax) {
                if (left <= rightRect.left-fieldRect.left+rightRect.width && didCollide(ball, ballRect, rightRect, fieldRect))
                    ball.direction.x = -ball.direction.x;
                else if (left > fieldRect.width) {
                    ball.speed = 0;
                    setPlayerLeft(oldState => ({...playerLeft, score: oldState.score+1}));
                }
            }
        }

    }

    useEffect(() => {
        let timeout;
        if (fieldRef) {
            const fieldRect = fieldRef.current.getBoundingClientRect();
            if (fieldRect.width > 2) {
                addLoopFunction('ballLoop', ballLoop);
                timeout = setTimeout(() => initBall(ballRef.current, fieldRect), 1000)
            }
        }
        return () => {
            clearTimeout(timeout);
            removeLoopFunction('ballLoop');
        }
    });

    return [gameOver, setGameover];
};

export default useBallLoop;