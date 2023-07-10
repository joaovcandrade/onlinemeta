import React from 'react';
import './Watermark.css'; // Importe o arquivo CSS para estilizar o elemento

const Watermark = () => {
  return (
    <div className="watermark-container">
      <img
        className="watermark-logo"
        src="/src/images/Logos.png" // Substitua pelo caminho correto para a sua logo
        alt="Logo"
      />
    </div>
  );
};

export default Watermark;
