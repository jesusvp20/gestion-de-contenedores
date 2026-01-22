import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Box,
    Users,
    ArrowLeftRight,
    LogOut,
    Menu,
    X,
    MapPin
} from 'lucide-react';
import { authService } from '../services';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const name = localStorage.getItem('user_name');
        if (!name) {
            navigate('/login');
        }
        setUserName(name || '');
    }, [navigate]);

    const handleLogout = async () => {
        const confirmed = window.confirm('¿Deseas cerrar sesión?');
        if (!confirmed) return;
        try {
            await authService.logout();
        } catch (err) {
            console.error('Error logging out:', err);
            localStorage.removeItem('auth_token');
        } finally {
            navigate('/login');
        }
    };

    const navItems = [
        { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Inicio', end: true },
        { path: '/dashboard/contenedores', icon: <Box size={20} />, label: 'Contenedores' },
        { path: '/dashboard/ubicaciones', icon: <MapPin size={20} />, label: 'Ubicaciones' },
        { path: '/dashboard/clientes', icon: <Users size={20} />, label: 'Clientes' },
        { path: '/dashboard/movimientos', icon: <ArrowLeftRight size={20} />, label: 'Movimientos' },
    ];

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <Box className="logo-accent" size={32} />
                        {isSidebarOpen && <span>GC Project</span>}
                    </div>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            {isSidebarOpen && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="content-topbar">
                    <div className="user-info">
                        <p>Bienvenido, <strong>{userName}</strong></p>
                    </div>
                </header>

                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
