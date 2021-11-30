import useFetch from '../../../hooks/useFetch';

import styles from './PlayerSelect.module.css';

const PlayerSelect = ({className, all, ignore, value, onChange}) => {

    const [error, data] = useFetch('/players');

    if (error) {
        return 'Error';
    }
    return (
        <select className={`${styles.playerSelect} ${styles[className]}`} 
            name="playerId" id="playerId" onChange={onChange} value={value ? value : ''}>
            {all ? <option value=''>Tous les joueurs</option> : <option value=''>Sélectionnez ...</option>}
            {data.map(player => 
                ignore && ignore.includes(player.id) ? null 
                    : <option key={player.id} value={player.id}>{player.name}</option>
            )}
        </select>
    );
};

export default PlayerSelect;