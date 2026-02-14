import React from 'react';

const Dwaid = () => {
  const containerStyle = {
    padding: '2rem',
    textAlign: 'center',
  };

  const headerStyle = {
    fontSize: '3rem',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '2rem',
  };

  const textStyle = {
    fontSize: '1.5rem',
    color: '#333',
    lineHeight: '1.6',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Witaj w module Dawid!</h1>
      <p style={textStyle}>
        To jest dynamicznie renderowany, kolorowy tekst, który ma za zadanie
        przyciągnąć Twoją uwagę i pokazać możliwości Reacta!
      </p>
    </div>
  );
};

export default Dwaid;