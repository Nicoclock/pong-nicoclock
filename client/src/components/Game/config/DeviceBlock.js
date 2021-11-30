import styles from '../Game.module.css';

const DeviceBlock = ({className, label, label2, src, alt, onClick}) => (
    <div className={`${styles.deviceBlock} ${styles[className]}`} onClick={onClick}>
        <h4>{label}</h4>
        {label2 && <h5>{label2}</h5>}
        <img src={src} alt={alt} />
    </div>
);

export default DeviceBlock;