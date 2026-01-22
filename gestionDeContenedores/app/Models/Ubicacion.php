<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo para la gestión de ubicaciones.
 */
class Ubicacion extends Model
{
    use HasFactory;

    // Desactivamos timestamps
    public $timestamps = false;

    // Nombre de la tabla
    protected $table = 'ubicacion';

    // Campos disponibles
    protected $fillable = [
        'nombre',
        'direccion',
        'fecha_movimiento'
    ];

    /**
     * Contenedores que se encuentran en esta ubicación.
     */
    public function contenedores()
    {
        return $this->hasMany(Contenedor::class, 'ubicacion_id');
    }
}
