import {useEffect, useContext} from 'react';

import GameContext from '../store/GameContext';

let count = 0;

const useDevices = (fieldRef, leftRef, rightRef) => {
    const ctx = useContext(GameContext);


    const handleKbUp = (key, dir, domRef, fieldHeight) => {
        if (ctx[`player${dir}`].up && ctx[`player${dir}`].up === key && domRef.current) {
            const top = parseInt(domRef.current.style.top) - fieldHeight*0.05;
            domRef.current.style.top = Math.max(top, 0)+'px';
        }
    }

    const handleKbDown = (key, dir, domRef, fieldHeight, height) => {
        if (ctx[`player${dir}`].down && ctx[`player${dir}`].down === key && domRef.current) {
            const top = parseInt(domRef.current.style.top) + fieldHeight*0.05;
            domRef.current.style.top = Math.min(top, fieldHeight-height)+'px';
        }
    }

    const handleGamepad = (dir, domRef, fieldHeight, height) => {
        const gamepad = (navigator.getGamepads() || navigator.webkitGetGamepads())[ctx[`player${dir}`].deviceIndex];
        if (gamepad) {
            if (gamepad.buttons[12].pressed) {
                const top = parseInt(domRef.current.style.top) - fieldHeight*0.006;
                domRef.current.style.top = Math.max(top, 0)+'px';
            }
            if (gamepad.buttons[13].pressed) {
                //bizarrement, le contrôle bas va moins vite que le contrôle haut
                const top = parseInt(domRef.current.style.top) + fieldHeight*0.009;
                domRef.current.style.top = Math.min(top, fieldHeight-height)+'px';
            }
        }
    }


    const handleKeyboard = event => {
        const fieldRect = fieldRef.current.getBoundingClientRect();
        const leftRect = leftRef.current.getBoundingClientRect();
        const rightRect = rightRef.current.getBoundingClientRect();

        if (fieldRef.current) {
            switch(event.key) {
                case 'ArrowUp':
                    handleKbUp('ArrowUp', 'Left', leftRef, fieldRect.height);
                    handleKbUp('ArrowUp', 'Right', rightRef, fieldRect.height);
                    break;
                case 'a':
                    handleKbUp('a', 'Left', leftRef, fieldRect.height);
                    handleKbUp('a', 'Right', rightRef, fieldRect.height);
                    break;
                case 'ArrowDown':
                    handleKbDown('ArrowDown', 'Left', leftRef, fieldRect.height, leftRect.height);
                    handleKbDown('ArrowDown', 'Right', rightRef, fieldRect.height, rightRect.height);
                    break;
                case 'q':
                    handleKbDown('q', 'Left', leftRef, fieldRect.height, leftRect.height);
                    handleKbDown('q', 'Right', rightRef, fieldRect.height, rightRect.height);
                    break;
                default: break;
            }
        }
    }
    useEffect(() => {
        const fieldRect = fieldRef.current.getBoundingClientRect();
        const leftRect = leftRef.current.getBoundingClientRect();
        const rightRect = rightRef.current.getBoundingClientRect();
        if (count < 2) {
            count++;
            leftRef.current.style.top = fieldRect.height*0.4 + 'px';
            rightRef.current.style.top = fieldRect.height*0.4 + 'px';
        }
        if (ctx.playerLeft.deviceIndex !== undefined) {
            ctx.addLoopFunction('gamepadLeft', () => handleGamepad('Left', leftRef, fieldRect.height, leftRect.height));
        }
        if (ctx.playerRight.deviceIndex !== undefined) {
            ctx.addLoopFunction('gamepadRight', () => handleGamepad('Right', rightRef, fieldRect.height, rightRect.height));
        }
        if (ctx.playerLeft.up || ctx.playerRight.up) {
            window.addEventListener('keydown', handleKeyboard, {passive: true});
        }
        return () => {
            window.removeEventListener('keydown', handleKeyboard)
            ctx.removeLoopFunction('gamepadLeft');
            ctx.removeLoopFunction('gamepadRight');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    })
};

export default useDevices;