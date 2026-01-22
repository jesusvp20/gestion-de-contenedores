<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo para la gestión de contenedores.
 */
class Contenedor extends Model
{
    use HasFactory;

    // Desactivamos timestamps si no existen en la tabla
    public $timestamps = false;
    
    // Nombre de la tabla en la base de datos
    protected $table = 'contenedores';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'codigo',
        'tipo_contenedor',
        'estado',
        'ubicacion_id',
        'capacidad'
    ];

    /**
     * Relación con la ubicación actual del contenedor.
     */
    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'ubicacion_id');
    }

    /**
     * Relación con los movimientos registrados para este contenedor.
     */
    public function movimientos()
    {
        return $this->hasMany(Movimiento::class, 'id_contenedor');
    }
}
