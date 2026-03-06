import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'

export default function Sidebar(){
  const logoSrc = '/logo.png'
  return (
    <aside className="sidebar">
      <div className="brand">
        <NavLink to="/" end style={{display:'inline-flex',alignItems:'center'}}>
          <img src={logoSrc} alt="Kavya Margin" onError={(e)=>{ e.currentTarget.style.display='none' }} />
          <span style={{fontWeight:700, fontSize:18, letterSpacing:0.2, marginLeft:8}}>Kavya Margin</span>
        </NavLink>
      </div>
      <nav>
        <ul>
          <li><NavLink to="/" end>Dashboard</NavLink></li>
          <li><NavLink to="/modules">Modules</NavLink></li>
          <li><NavLink to="/customers">Customers</NavLink></li>
          <li><NavLink to="/projects">Projects</NavLink></li>
          <li><NavLink to="/employees">Employees</NavLink></li>
          <li><NavLink to="/events">Events</NavLink></li>
          <li><NavLink to="/reports">Reports</NavLink></li>
          <li><NavLink to="/analytics">Analytics</NavLink></li>
        </ul>
      </nav>
    </aside>
  )
}
