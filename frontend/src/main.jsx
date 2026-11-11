import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Applications from './applications.jsx'
import AdminDashboard from "./admin_dashboard.jsx";
import Login from './login.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminDashboard />
  </StrictMode>,
)
