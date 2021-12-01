import {useEffect, useContext} from 'react';

import GameContext from '../store/GameContext';

let count = 0;

const useDevices = (fieldRef, leftRef, rightRef) => {
    const ctx = useContext(GameContext);

    const handleKbUp = (key, dir, player, fieldHeight) => {
        if (ctx[`player${dir}`].up && ctx[`player${dir}`].up === key && player) {
            const top = parseInt(player.style.top) - fieldHeight*0.05;
            player.style.top = Math.max(top, 0)+'px';
        }
    }

    const handleKbDown = (key, dir, player, fieldHeight, height) => {
        if (ctx[`player${dir}`].down && ctx[`player${dir}`].down === key && player) {
            const top = parseInt(player.style.top) + fieldHeight*0.05;
            player.style.top = Math.min(top, fieldHeight-height)+'px';
        }
    }

    const handleGamepad = (dir, player, fieldHeight, height) => {
//        const gamepad = ctx.gamepads[ctx[`player${dir}`].deviceIndex]; // ne fonctionne pas ...
        const gamepad = (navigator.getGamepads() || navigator.webkitGetGamepads())[ctx[`player${dir}`].deviceIndex];

        if (gamepad) {
            //haut sur la croix de direction dans le mapping standard
            if (gamepad.buttons[12].pressed) {
                const top = parseInt(player.style.top) - fieldHeight*0.006;
                player.style.top = Math.max(top, 0)+'px';
            }
            //bas sur la croix de direction dans le mapping standard
            if (gamepad.buttons[13].pressed) {
                //bizarrement, le contrôle bas va moins vite que le contrôle haut
                const top = parseInt(player.style.top) + fieldHeight*0.009;
                player.style.top = Math.min(top, fieldHeight-height)+'px';
            }
        }
    }


    const handleKeyboard = event => {
        const fieldRect = fieldRef.current.getBoundingClientRect();
        const leftRect = leftRef.current.getBoundingClientRect();
        const rightRect = rightRef.current.getBoundingClientRect();

        switch(event.key) {
            case 'ArrowUp':
                handleKbUp('ArrowUp', 'Left', leftRef.current, fieldRect.height);
                handleKbUp('ArrowUp', 'Right', rightRef.current, fieldRect.height);
                break;
            case 'a':
                handleKbUp('a', 'Left', leftRef.current, fieldRect.height);
                handleKbUp('a', 'Right', rightRef.current, fieldRect.height);
                break;
            case 'ArrowDown':
                handleKbDown('ArrowDown', 'Left', leftRef.current, fieldRect.height, leftRect.height);
                handleKbDown('ArrowDown', 'Right', rightRef.current, fieldRect.height, rightRect.height);
                break;
            case 'q':
                handleKbDown('q', 'Left', leftRef.current, fieldRect.height, leftRect.height);
                handleKbDown('q', 'Right', rightRef.current, fieldRect.height, rightRect.height);
                break;
            default: break;
        }
    }

    useEffect(() => {
        const fieldRect = fieldRef.current.getBoundingClientRect();
        const leftRect = leftRef.current.getBoundingClientRect();
        const rightRect = rightRef.current.getBoundingClientRect();
        //prend en compte la 1ère exécution où les dimensions du teraain sont incorrectes
        //évite de repositionner les raquettes à chaque round
        if (count < 2) {
            count++;
            leftRef.current.style.top = fieldRect.height*0.4 + 'px';
            rightRef.current.style.top = fieldRect.height*0.4 + 'px';
        }
        if (ctx.playerLeft.deviceIndex !== undefined) {
            ctx.addLoopFunction('gamepadLeft', () => handleGamepad('Left', leftRef.current, fieldRect.height, leftRect.height));
        }
        if (ctx.playerRight.deviceIndex !== undefined) {
            ctx.addLoopFunction('gamepadRight', () => handleGamepad('Right', rightRef.current, fieldRect.height, rightRect.height));
        }
        if (ctx.playerLeft.up || ctx.playerRight.up) {
            window.addEventListener('keydown', handleKeyboard, {passive: true});
        }
        return () => {
            window.removeEventListener('keydown', handleKeyboard)
            ctx.removeLoopFunction('gamepadLeft');
            ctx.removeLoopFunction('gamepadRight');
        }
    })
};

export default useDevices;