import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReactScan } from './ReactScan'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactScan />
    <App />
  </StrictMode>,
)
