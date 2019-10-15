import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

const Header = () => (
  <div>
    <ul className="ul_list">
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  </div>
);

export default Header;
