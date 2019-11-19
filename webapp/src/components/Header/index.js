import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

const Header = () => (
  <div>
    <ul className="ul_list">
      <li>
        <Link to="/" style={{ textDecoration: 'none' }}>Home</Link>
      </li>
      <li>
        <Link to="/login" style={{ textDecoration: 'none' }}>Login</Link>
      </li>
    </ul>
  </div>
);

export default Header;
