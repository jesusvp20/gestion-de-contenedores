<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Modelo para la gestión de usuarios (Personalizado).
 */
class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Desactivamos timestamps
    public $timestamps = false;

    // Nombre de la tabla
    protected $table = 'usuarios';

    // Campos disponibles
    protected $fillable = [
        'nombre',
        'email',
        'rol',
        'password',
        'movimiento_id'
    ];

    /**
     * Atributos ocultos.
     */
    protected $hidden = [
        'password'
    ];

    /**
     * Casts para atributos.
     */
    protected $casts = [
        'password' => 'hashed',
    ];

    /**
     * Relación con un movimiento específico (si aplica).
     */
    public function movimiento()
    {
        return $this->belongsTo(Movimiento::class, 'movimiento_id');
    }
}
