import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import './LoginPage.css';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await authService.forgotPassword(email);
            setMessage(response.message);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al procesar la solicitud.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <Card className="login-card">
                    <div className="login-header">
                        <h1>Recuperar Contraseña</h1>
                        <p>Ingresa tu correo para recibir un enlace</p>
                    </div>

                    {error && <div className="error-alert">{error}</div>}
                    {message && <div className="success-alert" style={{ backgroundColor: 'rgba(0, 255, 0, 0.1)', color: '#2ecc71', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@correo.com"
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={loading}
                        >
                            Enviar Enlace
                        </Button>
                    </form>

                    <div className="login-footer">
                        <p><Link to="/login">Volver al inicio de sesión</Link></p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
