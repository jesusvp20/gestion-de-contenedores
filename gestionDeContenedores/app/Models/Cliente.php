<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo para la gestión de clientes.
 */
class Cliente extends Model
{
    use HasFactory;

    // Desactivamos timestamps si no existen en la tabla
    public $timestamps = false;

    // Nombre de la tabla
    protected $table = 'clientes';

    // Campos permitidos
    protected $fillable = [
        'nombre',
        'numero_identificacion',
        'telefono'
    ];

    /**
     * Relación con los movimientos realizados por este cliente.
     */
    public function movimientos()
    {
        return $this->hasMany(Movimiento::class, 'id_cliente');
    }
}
