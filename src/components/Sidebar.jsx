import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/">Moduł Michał</Link></li>
        <li><Link to="/dwaid">Moduł Dwaid</Link></li>
        <li><Link to="/wrozka">Wróżka</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;