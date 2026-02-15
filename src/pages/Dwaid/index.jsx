import React from 'react';
import './style.css';

const Dwaid = () => {
  return (
    <div className="dwaid-container">
      <div className="dwaid-header">
        <h1>Witaj w module Dawid!</h1>
      </div>

      <div className="dwaid-content">
        <p className="dwaid-text">
          To jest dynamicznie renderowany, kolorowy tekst, który ma za zadanie
          przyciągnąć Twoją uwagę i pokazać możliwości Reacta!
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <span className="feature-icon">🎨</span>
            <h3 className="feature-title">Nowoczesny Design</h3>
            <p className="feature-description">
              Piękne gradienty i animacje CSS
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3 className="feature-title">Szybkie Działanie</h3>
            <p className="feature-description">
              Zoptymalizowane pod kątem wydajności
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">📱</span>
            <h3 className="feature-title">Responsywność</h3>
            <p className="feature-description">
              Działa na wszystkich urządzeniach
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dwaid;