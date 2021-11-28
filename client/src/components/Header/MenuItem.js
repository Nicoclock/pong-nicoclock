import {NavLink} from 'react-router-dom';

const MenuItem = ({item, className}) => (
    <li className={className}>
        <NavLink to={item.to} >{item.label}</NavLink>
    </li>
);

export default MenuItem;