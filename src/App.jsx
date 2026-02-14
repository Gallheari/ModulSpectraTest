import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Michal from './pages/Michal';
import Dwaid from './pages/Dwaid';
import Settings from './pages/Settings';
import Wrozka from './pages/Wrozka';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Michal />} />
            <Route path="/dwaid" element={<Dwaid />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/wrozka" element={<Wrozka />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;