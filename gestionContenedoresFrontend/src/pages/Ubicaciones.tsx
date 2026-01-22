import React, { useEffect, useRef, useState } from 'react';
import { Plus, Edit2, Trash2, Search, MapPin } from 'lucide-react';
import { ubicacionService } from '../services';
import type { Ubicacion } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import './Contenedores.css';

const Ubicaciones: React.FC = () => {
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const isAdmin = (localStorage.getItem('user_role') || 'usuario') === 'admin';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUbicacion, setEditingUbicacion] = useState<Ubicacion | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initializedRef = useRef(false);

    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        fecha_movimiento: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await ubicacionService.getUbicaciones();
            const list = (response.data || []);
            const unique = Array.from(new Map(list.map(u => [u.id, u])).values());
            setUbicaciones(unique);
        } catch (err) {
            console.error('Error fetching locations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;
        fetchData();
    }, []);

    const handleOpenModal = (ubicacion?: Ubicacion) => {
        if (ubicacion) {
            setEditingUbicacion(ubicacion);
            setFormData({
                nombre: ubicacion.nombre,
                direccion: ubicacion.direccion,
                fecha_movimiento: ubicacion.fecha_movimiento || new Date().toISOString().split('T')[0]
            });
        } else {
            setEditingUbicacion(null);
            setFormData({
                nombre: '',
                direccion: '',
                fecha_movimiento: new Date().toISOString().split('T')[0]
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isSubmitting) return;
            setIsSubmitting(true);
            if (editingUbicacion) {
                await ubicacionService.updateUbicacion(editingUbicacion.id, formData);
            } else {
                await ubicacionService.createUbicacion(formData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Error saving location:', err);
            alert('Error al guardar la ubicación');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta ubicación?')) {
            try {
                await ubicacionService.deleteUbicacion(id);
                fetchData();
            } catch (err) {
                console.error('Error deleting location:', err);
            }
        }
    };

    const filteredUbicaciones = ubicaciones.filter(u =>
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Gestión de Ubicaciones</h1>
                    <p>Administre los puntos de almacenamiento y terminales</p>
                </div>
                {isAdmin && (
                    <Button onClick={() => handleOpenModal()}>
                        <Plus size={18} /> Nueva Ubicación
                    </Button>
                )}
            </div>

            <Card className="table-card">
                <div className="table-filters">
                    <div className="search-bar">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o dirección..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Dirección</th>
                                <th>Última Actualización</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>Cargando datos...</td></tr>
                            ) : filteredUbicaciones.length === 0 ? (
                                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron ubicaciones</td></tr>
                            ) : (
                                filteredUbicaciones.map((u) => (
                                    <tr key={u.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <MapPin size={16} className="text-accent" />
                                                <strong>{u.nombre}</strong>
                                            </div>
                                        </td>
                                        <td>{u.direccion}</td>
                                        <td>{u.fecha_movimiento}</td>
                                        <td className="actions-cell">
                                            {isAdmin && (
                                                <>
                                                    <button className="action-btn edit" onClick={() => handleOpenModal(u)}>
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="action-btn delete" onClick={() => handleDelete(u.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
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
                title={editingUbicacion ? 'Editar Ubicación' : 'Nueva Ubicación'}
            >
                <form onSubmit={handleSubmit} className="modal-form">
                    <Input
                        label="Nombre de Ubicación"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej: Terminal A1"
                        required
                    />
                    <Input
                        label="Dirección"
                        value={formData.direccion}
                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                        placeholder="Dirección completa"
                        required
                    />
                    <Input
                        label="Fecha de Registro"
                        type="date"
                        value={formData.fecha_movimiento}
                        onChange={(e) => setFormData({ ...formData, fecha_movimiento: e.target.value })}
                        required
                    />
                    <div className="modal-actions">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>Guardar Ubicación</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Ubicaciones;
