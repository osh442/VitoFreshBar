import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './styles/variables.css';
import './styles/layout.css';
import './styles/header.css';
import './styles/footer.css';
import './styles/hero.css';
import './styles/menu.css';
import './styles/product.css';
import './styles/showcase.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
