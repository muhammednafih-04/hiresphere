import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Applications from './Application.jsx'
import AdminDashboard from "./Admin_dashboard.jsx";
import Login from './Login.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <admin_dashboard />
  </StrictMode>,
)
