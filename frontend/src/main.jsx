// Add at the top of src/main.jsx
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
