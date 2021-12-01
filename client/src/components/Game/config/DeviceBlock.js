import styles from '../Game.module.css';

/**
 * Permet la sélection du clavier ou d'un gamepad pour chaque joueur
 * @param {object} props 
 * @returns {JSX} Section de sélection d'un device de jeu
 */
const DeviceBlock = ({className, label, label2, src, alt, onClick}) => (
    <div className={`${styles.deviceBlock} ${styles[className]}`} onClick={onClick}>
        <h4>{label}</h4>
        {label2 && <h5>{label2}</h5>}
        <img src={src} alt={alt} />
    </div>
);

export default DeviceBlock;