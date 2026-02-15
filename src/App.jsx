import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Symbole from './pages/Symbole';
import Sekwencje from './pages/Sekwencje';
import Wzorce from './pages/Wzorce';
import Kategoryzacja from './pages/Kategoryzacja';
import Pamiec from './pages/Pamiec';
import PrzepiszSlowo from './pages/PrzepiszSlowo';
import Uczucia from './pages/Uczucia';
import Dwaid from './pages/Dwaid';
import Wrozka from './pages/Wrozka';
import Zjadanie from './pages/Zjadanie';
import Settings from './pages/Settings';
import MainMenu from './pages/MainMenu'; // This will be the new main page content
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/symbole" element={<Symbole />} />
            <Route path="/sekwencje" element={<Sekwencje />} />
            <Route path="/wzorce" element={<Wzorce />} />
            <Route path="/kategoryzacja" element={<Kategoryzacja />} />
            <Route path="/pamiec" element={<Pamiec />} />
            <Route path="/przepiszklowo" element={<PrzepiszSlowo />} />
            <Route path="/uczucia" element={<Uczucia />} />
            <Route path="/dwaid" element={<Dwaid />} />
            <Route path="/wrozka" element={<Wrozka />} />
            <Route path="/zjadanie" element={<Zjadanie />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
