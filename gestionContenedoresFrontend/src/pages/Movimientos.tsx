import React, { useEffect, useRef, useState } from 'react';
import { Plus, Search, ArrowLeftRight } from 'lucide-react';
import { movimientoService, contenedorService, ubicacionService, clienteService } from '../services';
import type { Movimiento, Contenedor, Ubicacion, Cliente } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import './Contenedores.css';

const Movimientos: React.FC = () => {
    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const [contenedores, setContenedores] = useState<Contenedor[]>([]);
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [combosLoading, setCombosLoading] = useState(false);

    const [formData, setFormData] = useState({
        id_contenedor: '',
        id_ubicacion: '',
        id_cliente: '',
        fecha_movimiento: new Date().toISOString().split('T')[0],
        movimiento_registrado: ''
    });
    const initializedRef = useRef(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [movRes, contRes, ubiRes, cliRes] = await Promise.all([
                movimientoService.getMovimientos(),
                contenedorService.getContenedores(),
                ubicacionService.getUbicaciones(),
                clienteService.getClientes()
            ]);
            const movList = (movRes.data || []);
            setMovimientos(movList);
            const contUnique = Array.from(new Map((contRes.data || []).map(c => [c.id, c])).values());
            setContenedores(contUnique);
            const ubiUnique = Array.from(new Map((ubiRes.data || []).map(u => [u.id, u])).values());
            setUbicaciones(ubiUnique);
            const cliUnique = Array.from(new Map((cliRes.data || []).map(c => [c.id, c])).values());
            setClientes(cliUnique);
        } catch (err) {
            console.error('Error fetching movements:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;
        fetchData();
    }, []);

    const handleOpenModal = async () => {
        setFormData({
            id_contenedor: '',
            id_ubicacion: '',
            id_cliente: '',
            fecha_movimiento: new Date().toISOString().split('T')[0],
            movimiento_registrado: ''
        });
        setIsModalOpen(true);
        setCombosLoading(true);
        try {
            const [contRes, ubiRes, cliRes] = await Promise.all([
                contenedorService.getContenedores(),
                ubicacionService.getUbicaciones(),
                clienteService.getClientes()
            ]);
            const contUnique = Array.from(new Map((contRes.data || []).map(c => [c.id, c])).values());
            setContenedores(contUnique);
            const ubiUnique = Array.from(new Map((ubiRes.data || []).map(u => [u.id, u])).values());
            setUbicaciones(ubiUnique);
            const cliUnique = Array.from(new Map((cliRes.data || []).map(c => [c.id, c])).values());
            setClientes(cliUnique);
        } catch (err) {
            console.error('Error refreshing combos:', err);
        } finally {
            setCombosLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isSubmitting) return;
            if (!formData.id_contenedor || !formData.id_cliente || !formData.id_ubicacion || !formData.movimiento_registrado.trim()) {
                alert('Seleccione contenedor, cliente, ubicación y descripción');
                return;
            }
            setIsSubmitting(true);
            const payload = {
                id_contenedor: Number(formData.id_contenedor),
                id_cliente: Number(formData.id_cliente),
                id_ubicacion: Number(formData.id_ubicacion),
                fecha_movimiento: formData.fecha_movimiento,
                movimiento_registrado: formData.movimiento_registrado.trim()
            };
            await movimientoService.createMovimiento(payload);
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Error saving movement:', err);
            const msg = (err as any)?.response?.data?.message || 'Error al registrar el movimiento';
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredMovimientos = movimientos.filter(m =>
        m.movimiento_registrado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.contenedor?.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="contenedores-page">
            <div className="page-header">
                <div>
                    <h1>Gestión de Movimientos</h1>
                    <p>Registre y consulte el historial de movimientos de contenedores</p>
                </div>
                <Button onClick={handleOpenModal}>
                    <Plus size={18} /> Registrar Movimiento
                </Button>
            </div>

            <Card className="table-card">
                <div className="table-filters">
                    <div className="search-bar">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por contenedor, cliente o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Contenedor</th>
                                <th>Cliente</th>
                                <th>Ubicación</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Cargando datos...</td></tr>
                            ) : filteredMovimientos.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron movimientos</td></tr>
                            ) : (
                                filteredMovimientos.map((m) => (
                                    <tr key={m.id}>
                                        <td>{m.fecha_movimiento}</td>
                                        <td>
                                            <span className="code-badge">{m.contenedor?.codigo || 'N/A'}</span>
                                        </td>
                                        <td>{m.cliente?.nombre || 'N/A'}</td>
                                        <td>{m.ubicacion?.nombre || 'N/A'}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <ArrowLeftRight size={14} className="text-accent" />
                                                {m.movimiento_registrado}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Registrar Nuevo Movimiento"
            >
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label className="input-label">Contenedor</label>
                        <select
                            className="custom-select"
                            value={formData.id_contenedor}
                            onChange={(e) => setFormData({ ...formData, id_contenedor: e.target.value })}
                            required
                            disabled={combosLoading}
                        >
                            <option value="">Seleccione un contenedor</option>
                            {contenedores.map(c => (
                                <option key={c.id} value={c.id}>{c.codigo} - {c.tipo_contenedor}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="input-label">Cliente</label>
                        <select
                            className="custom-select"
                            value={formData.id_cliente}
                            onChange={(e) => setFormData({ ...formData, id_cliente: e.target.value })}
                            required
                            disabled={combosLoading}
                        >
                            <option value="">Seleccione un cliente</option>
                            {clientes.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="input-label">Ubicación</label>
                        <select
                            className="custom-select"
                            value={formData.id_ubicacion}
                            onChange={(e) => setFormData({ ...formData, id_ubicacion: e.target.value })}
                            required
                            disabled={combosLoading}
                        >
                            <option value="">Seleccione una ubicación</option>
                            {ubicaciones.map(u => (
                                <option key={u.id} value={u.id}>{u.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Fecha de Movimiento"
                        type="date"
                        value={formData.fecha_movimiento}
                        onChange={(e) => setFormData({ ...formData, fecha_movimiento: e.target.value })}
                        required
                    />
                    <Input
                        label="Descripción del Movimiento"
                        value={formData.movimiento_registrado}
                        onChange={(e) => setFormData({ ...formData, movimiento_registrado: e.target.value })}
                        placeholder="Ej: Carga de mercancía"
                        required
                    />
                    <div className="modal-actions">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting || combosLoading}>Registrar Movimiento</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Movimientos;
