import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PrzepiszSlowo from './pages/PrzepiszSlowo';
import Dwaid from './pages/Dwaid';
import Settings from './pages/Settings';
import Zjadanie from './pages/Zjadanie';
import Wrozka from './pages/Wrozka';
import Uczucia from './pages/Uczucia';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<PrzepiszSlowo />} />
            <Route path="/dwaid" element={<Dwaid />} />
            <Route path="/zjadanie" element={<Zjadanie />} />
            <Route path="/wrozka" element={<Wrozka />} />
            <Route path="/uczucia" element={<Uczucia />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;