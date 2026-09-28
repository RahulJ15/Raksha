import { createRoot } from 'react-dom/client'
import './index.css'
import './infrasensor/main.css'
import App from './App.jsx'

// No StrictMode: the ported component's animation loop assumes a single mount.
createRoot(document.getElementById('root')).render(<App />)
