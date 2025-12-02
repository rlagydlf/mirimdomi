import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Navigation/Sidebar';
import './Layout.css';

function Layout({ userInfo, onLogout }) {
  return (
    <div className="layout">
      <Sidebar userInfo={userInfo} onLogout={onLogout} />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

