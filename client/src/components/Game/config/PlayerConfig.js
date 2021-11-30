import {useContext} from 'react';

import GameContext from '../../../store/GameContext';
import PlayerSelect from '../../common/PlayerSelect/PlayerSelect';
import DeviceBlock from './DeviceBlock';
import GamepadSelect from './GamepadSelect';

import kb from '../../../assets/keyboard.png';
import gamepad from '../../../assets/gamepad.png';


const PlayerConfig = ({player, other, position, label2, setPlayer, gamepads, keyboard}) => {
    const {players} = useContext(GameContext);

    const set = event => {
        setPlayer(event.target.value ? {...players.find(player => player.id === +event.target.value)} : undefined);
    }

    const setKeyboard = () => {
        setPlayer({...player, device: 'keyboard', ...keyboard, deviceIndex: undefined});
    }

    const setGpChoice = () => {
        setPlayer({...player, device: 'gamepad', deviceIndex: undefined, up: undefined, down: undefined});
    }

    const setGamepad = event => {
        setPlayer({...player, deviceIndex: event.target.value ? +event.target.value : undefined});
    }

    return (
        <div>
        <h2>Joueur de {position} : </h2>
        <section>
            <h3>Choisissez votre joueur</h3>
            <PlayerSelect className="players" onChange={set} 
                ignore={[other?.id]} value={player ? player.id : ''}/>
        </section>
        {player &&
            <section>
                <h3>Choisissez comment jouer</h3>
                <DeviceBlock onClick={setKeyboard} className={player.device === 'keyboard' ? 'selected' : ''} 
                    label="Au clavier" label2={label2} src={kb} alt="Jouer au clavier" />
                <DeviceBlock onClick={setGpChoice}  className={player.device === 'gamepad' ? 'selected' : ''} 
                    label="Au gamepad" src={gamepad} alt="Jouer au gamepad" />
                {player.device === 'gamepad' && 
                    <GamepadSelect className="players" ignore={[other?.deviceIndex]} 
                        value={player.deviceIndex} onChange={setGamepad} gamepads={gamepads}/>}
            </section>
        }
    </div>

    );
};

export default PlayerConfig;