import { NavLink } from 'react-router-dom';

import Menu from './Menu';

import logo from '../../assets/logo.png';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <NavLink to="/">
                <img src={logo} alt="Jeu de pong" />
            </NavLink>
            <Menu />
        </header>
    )
}

export default Header;