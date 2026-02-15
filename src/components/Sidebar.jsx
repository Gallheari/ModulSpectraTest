import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const modules = [
        { path: '/', name: 'Menu Główne' },
        { path: '/symbole', name: 'Analiza Symboli i Obrazów' },
        { path: '/sekwencje', name: 'Rozumienie Sekwencji' },
        { path: '/wzorce', name: 'Wzorce i Układy' },
        { path: '/kategoryzacja', name: 'Kategoryzacja i Sortowanie' },
        { path: '/pamiec', name: 'Pamięć i Koncentracja' },
        { path: '/przepiszklowo', name: 'Przepisz Słowo' },
        { path: '/uczucia', name: 'Uczucia' },
        { path: '/dwaid', name: 'Dwaid' },
        { path: '/wrozka', name: 'Wróżka' },
        { path: '/zjadanie', name: 'Zjadanie' },
        { path: '/settings', name: 'Ustawienia' }
    ];

    return (
        <div className="sidebar">
            <h1 className="sidebar-title">Moduł Spectra</h1>
            <nav className="sidebar-nav">
                {modules.map((module) => (
                    <NavLink
                        to={module.path}
                        key={module.path}
                        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
                    >
                        {module.name}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
