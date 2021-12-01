import trier from '../../assets/trier.png';
import trierCurrent from '../../assets/trierCurrent.png';

/**
 * Un intitullé de colonne cliquable
 * @param {object} props 
 * @returns {JSX} 
 */
const SortableTh = ({className, sortBy, onClick, children}) => {
    return (
        <th role="columnheader" className={className} onClick={onClick}>
            {children}
            {children === sortBy ?
                <img src={trierCurrent} alt="Inverser l'ordre de tri" />
            :
                <img src={trier} alt="Trier la colonne" />
            }
        </th>
    )
};

export default SortableTh;