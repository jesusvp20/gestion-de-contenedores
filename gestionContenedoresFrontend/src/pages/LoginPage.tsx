import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { authService } from '../services';

const LoginPage: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login({ nombre, password });
            if (response.status === 'success') {
                localStorage.setItem('auth_token', response.access_token);
                localStorage.setItem('user_name', response.data.nombre);
                navigate('/dashboard');
            } else {
                setError(response.message || 'Error al iniciar sesión');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="logo-icon">
                        <LogIn size={40} className="text-accent" />
                    </div>
                    <h1>Gestión de Contenedores</h1>
                </div>

                <Card className="login-card">
                    <form onSubmit={handleLogin}>
                        <Input
                            label="Nombre de Usuario"
                            placeholder="Ej: Administrador"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                        <div style={{ position: 'relative' }}>
                            <Input
                                label="Contraseña"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '10px' }}>
                                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        </div>

                        {error && <div className="login-error-alert">{error}</div>}

                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full"
                        >
                            Iniciar Sesión
                        </Button>
                    </form>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <p style={{ fontSize: '0.9rem' }}>
                            ¿No tienes cuenta? <Link to="/register" style={{ fontWeight: '600', color: 'var(--accent)' }}>Regístrate</Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
