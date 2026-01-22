import React, { useEffect, useRef, useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import type { Contenedor, Ubicacion } from '../types';
import { contenedorService, ubicacionService } from '../services';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import './Contenedores.css';

const Contenedores: React.FC = () => {
    const [contenedores, setContenedores] = useState<Contenedor[]>([]);
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const isAdmin = (localStorage.getItem('user_role') || 'usuario') === 'admin';

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContenedor, setEditingContenedor] = useState<Contenedor | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initializedRef = useRef(false);

    // Form state
    const [formData, setFormData] = useState({
        codigo: '',
        tipo_contenedor: '',
        capacidad: 0,
        estado: true,
        ubicacion_id: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [contRes, ubiRes] = await Promise.all([
                contenedorService.getContenedores(),
                ubicacionService.getUbicaciones()
            ]);
            const contList = (contRes.data || []);
            const contUnique = Array.from(new Map(contList.map(c => [c.id, c])).values());
            setContenedores(contUnique);
            const ubiList = (ubiRes.data || []);
            const ubiUnique = Array.from(new Map(ubiList.map(u => [u.id, u])).values());
            setUbicaciones(ubiUnique);
        } catch (err) {
            console.error('Error fetching containers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;
        fetchData();
    }, []);

    const handleOpenModal = (contenedor?: Contenedor) => {
        if (contenedor) {
            setEditingContenedor(contenedor);
            setFormData({
                codigo: contenedor.codigo,
                tipo_contenedor: contenedor.tipo_contenedor,
                capacidad: contenedor.capacidad,
                estado: contenedor.estado,
                ubicacion_id: contenedor.ubicacion_id?.toString() || ''
            });
        } else {
            setEditingContenedor(null);
            setFormData({
                codigo: '',
                tipo_contenedor: '',
                capacidad: 0,
                estado: true,
                ubicacion_id: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isSubmitting) return;
            const capacidadNum = Number(formData.capacidad);
            if (!formData.codigo || !formData.tipo_contenedor || Number.isNaN(capacidadNum) || capacidadNum <= 0) {
                alert('Complete código, tipo y una capacidad válida mayor a 0');
                return;
            }
            setIsSubmitting(true);
            const payload: any = {
                codigo: formData.codigo,
                tipo_contenedor: formData.tipo_contenedor,
                capacidad: capacidadNum,
                estado: formData.estado
            };
            if (formData.ubicacion_id) {
                payload.ubicacion_id = Number(formData.ubicacion_id);
            }
            if (editingContenedor) {
                await contenedorService.updateContenedor(editingContenedor.id, payload);
            } else {
                await contenedorService.createContenedor(payload);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Error saving container:', err);
            const msg = (err as any)?.response?.data?.message || 'Error al guardar el contenedor';
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este contenedor?')) {
            try {
                await contenedorService.deleteContenedor(id);
                fetchData();
            } catch (err) {
                console.error('Error deleting container:', err);
            }
        }
    };

    const filteredContenedores = contenedores.filter(c =>
        c.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tipo_contenedor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="contenedores-page">
            <div className="page-header">
                <div>
                    <h1>Gestión de Contenedores</h1>
                    <p>Administre el inventario y estado de sus contenedores</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus size={18} /> Nuevo Contenedor
                </Button>
            </div>

            <Card className="table-card">
                <div className="table-filters">
                    <div className="search-bar">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por código o tipo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Tipo</th>
                                <th>Capacidad</th>
                                <th>Estado</th>
                                <th>Ubicación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Cargando datos...</td></tr>
                            ) : filteredContenedores.length === 0 ? (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron contenedores</td></tr>
                            ) : (
                                filteredContenedores.map((c) => (
                                    <tr key={c.id}>
                                        <td><span className="code-badge">{c.codigo}</span></td>
                                        <td>{c.tipo_contenedor}</td>
                                        <td>{c.capacidad} m³</td>
                                        <td>
                                            <span className={`status-badge ${c.estado ? 'active' : 'inactive'}`}>
                                                {c.estado ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>{c.ubicacion?.nombre || 'No asignada'}</td>
                                        <td className="actions-cell">
                                            <button className="action-btn edit" onClick={() => handleOpenModal(c)}>
                                                <Edit2 size={16} />
                                            </button>
                                            {isAdmin && (
                                                <button className="action-btn delete" onClick={() => handleDelete(c.id)}>
                                                    <Trash2 size={16} />
                                                </button>
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
                title={editingContenedor ? 'Editar Contenedor' : 'Nuevo Contenedor'}
            >
                <form onSubmit={handleSubmit} className="modal-form">
                    <Input
                        label="Código de Contenedor"
                        value={formData.codigo}
                        onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                        required
                        disabled={!!editingContenedor}
                    />
                    <Input
                        label="Tipo de Contenedor"
                        value={formData.tipo_contenedor}
                        onChange={(e) => setFormData({ ...formData, tipo_contenedor: e.target.value })}
                        placeholder="Ej: Dry Van, Refrigerado"
                        required
                    />
                    <Input
                        label="Capacidad (m³)"
                        type="number"
                        value={formData.capacidad}
                        onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) })}
                        required
                    />
                    <div className="form-group">
                        <label className="input-label">Ubicación</label>
                        <select
                            className="custom-select"
                            value={formData.ubicacion_id}
                            onChange={(e) => setFormData({ ...formData, ubicacion_id: e.target.value })}
                        >
                            <option value="">Seleccione una ubicación</option>
                            {ubicaciones.map(u => (
                                <option key={u.id} value={u.id}>{u.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group checkbox">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={formData.estado}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.checked })}
                            />
                            <span className="slider round"></span>
                        </label>
                        <span>Estado Activo</span>
                    </div>
                    <div className="modal-actions">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>Guardar Contenedor</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Contenedores;
