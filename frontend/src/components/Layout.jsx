import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        
        {/* THIS IS THE MAGIC WORD! The Dashboard will load right here: */}
        <div style={{ padding: '20px' }}>
          <Outlet /> 
        </div>
        
      </div>
    </div>
  );
}