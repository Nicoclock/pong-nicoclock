import {useLocation} from 'react-router-dom';

import MenuItem from './MenuItem';

import styles from './Menu.module.css';

const Menu = () => {

    const location = useLocation()

    const items = [
        {to: '/', label: 'Accueil'},
        {to: '/game', label: 'Jouer'},
        {to: '/scores', label: 'Scores'}
    ];
    return (
        <nav>
            <ul>
                {items.map(item => (
                    <MenuItem key={item.to} item={item} className={item.to === location.pathname ? styles.active : ''} />
                ))}
            </ul>
        </nav>
    );
}

export default Menu;