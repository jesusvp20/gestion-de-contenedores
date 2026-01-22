<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo para el registro de movimientos de contenedores.
 */
class Movimiento extends Model
{
    use HasFactory;

    // Desactivamos timestamps
    public $timestamps = false;

    // Nombre de la tabla
    protected $table = 'movimientos';

    // Campos disponibles
    protected $fillable = [
        'id_contenedor',
        'id_ubicacion',
        'fecha_movimiento',
        'movimiento_registrado',
        'id_cliente'
    ];

    /**
     * Obtener el contenedor asociado al movimiento.
     */
    public function contenedor()
    {
        return $this->belongsTo(Contenedor::class, 'id_contenedor');
    }

    /**
     * Obtener la ubicación asociada al movimiento.
     */
    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'id_ubicacion');
    }

    /**
     * Obtener el cliente asociado al movimiento.
     */
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }
}
