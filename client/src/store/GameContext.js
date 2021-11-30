import {createContext, useState} from 'react';
import env from 'react-dotenv';

const GameContext = createContext({
    players: [],
    setPlayers: () => {},
    playerLeft: null,
    setPlayerLeft: () => {},
    playerRight: null,
    setPlayerRight: () => {},
    gamepads: {},
    setGamepads: () => {},
    loopFunctions: {},
    addLoopFunction: () => {},
    removeLoopFunction: () => {},
    gameOver: false,
    closeGame: () => {}
});

export const GameProvider = ({children}) => {

    const [playerLeft, setPlayerLeft] = useState(null);
    const [playerRight, setPlayerRight] = useState(null);
    const [players, setPlayers] = useState([]);
    const [gamepads, setGamepads] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [ready, setReady] = useState(false);

    let done = false;

    const loopFunctions = {};

    const addLoopFunction = (name, func) => {
        if (!loopFunctions[name]) {
            //console.log('adding', name);
            loopFunctions[name] = func;
        }
    }

    const removeLoopFunction = name => {
        if (loopFunctions[name]) {
            //console.log('removing', name);
            delete loopFunctions[name];
        }
    }

    const closeGame = async () => {
        if (!done) {
            done = true;
            try {
                const result = await fetch(`${env.API_URL}/scores`, {
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify({
                        joueur1: playerLeft.id,
                        score1: playerLeft.score,
                        joueur2: playerRight.id,
                        score2: playerRight.score
                    })
                });
                if (!result.ok) {
                    console.log(await result.json());
                }
            } catch(error) {
                console.log(error.message);
            }
            setGameOver(true);
        }
    };

    const resetGame = () => {
        setPlayerLeft({...playerLeft, score: 0});
        setPlayerRight({...playerRight, score: 0});
        setGameOver(false);
    };

    const resetPlayers = () => {
        setPlayerLeft(null);
        setPlayerRight(null);
        setReady(false);
        setGameOver(false);
    }

    const value = {
        players,
        setPlayers,
        playerLeft,
        setPlayerLeft,
        playerRight,
        setPlayerRight,
        gamepads,
        setGamepads,
        loopFunctions,
        addLoopFunction,
        removeLoopFunction,
        gameOver,
        closeGame,
        resetGame,
        resetPlayers,
        ready,
        setReady
    }

    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    )
};

export default GameContext;