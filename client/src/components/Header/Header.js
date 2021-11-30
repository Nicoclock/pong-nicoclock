import {memo} from 'react';
import { NavLink } from 'react-router-dom';

import Menu from './Menu';

import logo from '../../assets/logo.png';
import styles from './Header.module.css';

const Header = () => (
    <header className={styles.header}>
        <NavLink to="/">
            <img src={logo} alt="Jeu de pong" />
        </NavLink>
        <Menu />
    </header>
);

export default memo(Header);