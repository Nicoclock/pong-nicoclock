
import styles from '../Game.module.css';

const GamepadSelect = ({className, ignore, value, onChange, gamepads}) => {
    return (
        <select className={styles[className]} onChange={onChange} value={value !== undefined ? value : ''}>
            <option value=''>Sélectionnez ...</option>
            {Array.from(gamepads).filter(el => el).map(gamepad => 
                ignore && ignore.includes(gamepad.index) ? null 
                    : <option key={gamepad.index} value={gamepad.index}>Gamepad {gamepad.index}</option>
            )}
        </select>
    );
};

export default GamepadSelect;