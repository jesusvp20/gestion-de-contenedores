import React, { useEffect, useState } from 'react';
import { Users, ArrowLeftRight, Navigation, Box } from 'lucide-react';
import Card from '../components/Card';
import { contenedorService, clienteService, movimientoService, ubicacionService } from '../services';
import './DashboardHome.css';

const DashboardHome: React.FC = () => {
    const [stats, setStats] = useState({
        contenedores: 0,
        clientes: 0,
        movimientos: 0,
        ubicaciones: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [cont, cli, mov, ubi] = await Promise.all([
                    contenedorService.getContenedores(),
                    clienteService.getClientes(),
                    movimientoService.getMovimientos(),
                    ubicacionService.getUbicaciones()
                ]);

                setStats({
                    contenedores: (cont.data || []).length,
                    clientes: (cli.data || []).length,
                    movimientos: (mov.data || []).length,
                    ubicaciones: (ubi.data || []).length
                });
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: 'Contenedores', value: stats.contenedores, icon: <Box size={24} />, color: 'blue' },
        { label: 'Clientes', value: stats.clientes, icon: <Users size={24} />, color: 'purple' },
        { label: 'Movimientos', value: stats.movimientos, icon: <ArrowLeftRight size={24} />, color: 'green' },
        { label: 'Ubicaciones', value: stats.ubicaciones, icon: <Navigation size={24} />, color: 'orange' },
    ];

    return (
        <div className="dashboard-home">
            <div className="home-header">
                <h1>Vista General</h1>
                <p>Resumen del estado actual del sistema</p>
            </div>

            <div className="stats-grid">
                {statCards.map((stat) => (
                    <Card key={stat.label} className={`stat-card ${stat.color}`}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <span className="stat-label">{stat.label}</span>
                            <h2 className="stat-value">{loading ? '...' : stat.value}</h2>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="home-content">
                <Card title="Sistema de Gestión de Contenedores" className="info-card">
                    <p>
                        Bienvenido al sistema de administración. Utilice la barra lateral para navegar entre las diferentes secciones.
                        Aquí podrá gestionar el inventario de contenedores, registrar movimientos, y administrar la base de datos de clientes.
                    </p>

                </Card>
            </div>
        </div>
    );
};

export default DashboardHome;
