<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContenedorController;
use App\Http\Controllers\UbicacionController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\MovimientoController;
use App\Http\Controllers\ClienteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rutas para Contenedores
Route::prefix('contenedores')->group(function () {
    Route::get('/', [ContenedorController::class, 'listar']);
    Route::post('/', [ContenedorController::class, 'crear']);
    Route::get('/{id}', [ContenedorController::class, 'encontrar']);
    Route::put('/{id}', [ContenedorController::class, 'actualizar']);
    Route::delete('/{id}', [ContenedorController::class, 'eliminar']);
});

// Rutas para Ubicaciones
Route::prefix('ubicaciones')->group(function () {
    Route::get('/', [UbicacionController::class, 'listar']);
    Route::get('/{id}', [UbicacionController::class, 'buscarUbicacion']);
    Route::post('/', [UbicacionController::class, 'crear']);
    Route::put('/{id}', [UbicacionController::class, 'actualizar']);
    Route::delete('/{id}', [UbicacionController::class, 'eliminar']);
});

// Rutas para Usuarios
Route::prefix('usuarios')->group(function () {
    Route::get('/', [UsuarioController::class, 'listar']);
    Route::get('/{id}', [UsuarioController::class, 'buscarUsuario']);
    Route::post('/registrar', [UsuarioController::class, 'registrar']);
    Route::post('/login', [UsuarioController::class, 'login']);
    Route::post('/forgot-password', [UsuarioController::class, 'forgotPassword']);
    
    Route::middleware('auth:sanctum')->post('/logout', [UsuarioController::class, 'logout']);
});

// Rutas para Movimientos
Route::prefix('movimientos')->group(function () {
    Route::get('/', [MovimientoController::class, 'listar']);
    Route::get('/{id}', [MovimientoController::class, 'buscarMovimiento']);
    Route::post('/', [MovimientoController::class, 'crear']);
    Route::put('/{id}', [MovimientoController::class, 'actualizar']);
    Route::delete('/{id}', [MovimientoController::class, 'eliminar']);
});

// Rutas para Clientes
Route::prefix('clientes')->group(function () {
    Route::get('/', [ClienteController::class, 'listar']);
    Route::post('/', [ClienteController::class, 'crear']);
    Route::get('/{id}', [ClienteController::class, 'buscarCliente']);
    Route::put('/{id}', [ClienteController::class, 'actualizar']);
    Route::delete('/{id}', [ClienteController::class, 'eliminar']);
    Route::get('/{id}/movimientos', [ClienteController::class, 'buscarMovimientosPorCliente']);
});
