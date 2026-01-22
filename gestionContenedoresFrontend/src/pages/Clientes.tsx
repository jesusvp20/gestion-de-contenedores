import React, { useEffect, useRef, useState } from 'react';
import { Plus, Edit2, Trash2, Search, User } from 'lucide-react';
import { clienteService } from '../services';
import type { Cliente } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import './Contenedores.css';

const Clientes: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initializedRef = useRef(false);

    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        numero_identificacion: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await clienteService.getClientes();
            const list = (response.data || []);
            const unique = Array.from(new Map(list.map(c => [c.id, c])).values());
            setClientes(unique);
        } catch (err) {
            console.error('Error fetching clients:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;
        fetchData();
    }, []);

    const handleOpenModal = (cliente?: Cliente) => {
        if (cliente) {
            setEditingCliente(cliente);
            setFormData({
                nombre: cliente.nombre,
                telefono: cliente.telefono,
                numero_identificacion: cliente.numero_identificacion.toString()
            });
        } else {
            setEditingCliente(null);
            setFormData({
                nombre: '',
                telefono: '',
                numero_identificacion: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isSubmitting) return;
            setIsSubmitting(true);
            const numero = Number(formData.numero_identificacion);
            if (!formData.nombre.trim() || !formData.telefono.trim() || Number.isNaN(numero) || numero <= 0) {
                alert('Complete nombre, teléfono y un número de identificación válido');
                setIsSubmitting(false);
                return;
            }
            const payload = {
                nombre: formData.nombre.trim(),
                telefono: formData.telefono.trim(),
                numero_identificacion: numero
            };
            if (editingCliente) {
                await clienteService.updateCliente(editingCliente.id, payload);
            } else {
                await clienteService.createCliente(payload);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Error saving client:', err);
            const msg = (err as any)?.response?.data?.message || 'Error al guardar el cliente';
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este cliente?')) {
            try {
                await clienteService.deleteCliente(id);
                fetchData();
            } catch (err) {
                console.error('Error deleting client:', err);
            }
        }
    };

    const filteredClientes = clientes.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.telefono.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.numero_identificacion.toString().includes(searchTerm)
    );

    return (
        <div className="contenedores-page">
            <div className="page-header">
                <div>
                    <h1>Gestión de Clientes</h1>
                    <p>Administre la base de datos de clientes</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus size={18} /> Nuevo Cliente
                </Button>
            </div>

            <Card className="table-card">
                <div className="table-filters">
                    <div className="search-bar">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, teléfono o identificación..."
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
                                <th>Teléfono</th>
                                <th>Identificación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>Cargando datos...</td></tr>
                            ) : filteredClientes.length === 0 ? (
                                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron clientes</td></tr>
                            ) : (
                                filteredClientes.map((c) => (
                                    <tr key={c.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <User size={16} className="text-accent" />
                                                <strong>{c.nombre}</strong>
                                            </div>
                                        </td>
                                        <td>{c.telefono}</td>
                                        <td><span className="code-badge">{c.numero_identificacion}</span></td>
                                        <td className="actions-cell">
                                            <button className="action-btn edit" onClick={() => handleOpenModal(c)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="action-btn delete" onClick={() => handleDelete(c.id)}>
                                                <Trash2 size={16} />
                                            </button>
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
                title={editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
            >
                <form onSubmit={handleSubmit} className="modal-form">
                    <Input
                        label="Nombre Completo"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej: Juan Pérez"
                        required
                    />
                    <Input
                        label="Teléfono"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        placeholder="Ej: +1234567890"
                        required
                    />
                    <Input
                        label="Número de Identificación"
                        type="number"
                        value={formData.numero_identificacion}
                        onChange={(e) => setFormData({ ...formData, numero_identificacion: e.target.value })}
                        placeholder="Ej: 123456789"
                        required
                        disabled={!!editingCliente}
                    />
                    <div className="modal-actions">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>Guardar Cliente</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Clientes;
