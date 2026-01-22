<?php

namespace App\Http\Controllers;

use App\Models\Movimiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Controlador para el registro de movimientos de contenedores.
 */
class MovimientoController extends Controller
{
    /**
     * Lista todos los movimientos con sus relaciones.
     */
    public function listar()
    {
        $movimientos = Movimiento::with(['contenedor', 'ubicacion', 'cliente'])->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $movimientos
        ], 200);
    }

    /**
     * Crea un nuevo registro de movimiento.
     */
    public function crear(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_contenedor' => 'required|exists:contenedores,id',
            'id_ubicacion' => 'required|exists:ubicacion,id',
            'id_cliente' => 'required|exists:clientes,id',
            'fecha_movimiento' => 'required|date',
            'movimiento_registrado' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ], 400);
        }

        $movimiento = Movimiento::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Movimiento registrado exitosamente',
            'data' => $movimiento
        ], 201);
    }

    /**
     * Busca un movimiento por ID.
     */
    public function buscarMovimiento($id)
    {
        $movimiento = Movimiento::with(['contenedor', 'ubicacion', 'cliente'])->find($id);

        if (!$movimiento) {
            return response()->json([
                'status' => 'error',
                'message' => 'Movimiento no encontrado',
                'statusCode' => 404
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $movimiento
        ], 200);
    }

    /**
     * Actualiza un movimiento existente.
     */
    public function actualizar(Request $request, $id)
    {
        $movimiento = Movimiento::find($id);

        if (!$movimiento) {
            return response()->json([
                'status' => 'error',
                'message' => 'Movimiento no encontrado',
                'statusCode' => 404
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'id_contenedor' => 'required|exists:contenedores,id',
            'id_ubicacion' => 'required|exists:ubicacion,id',
            'id_cliente' => 'required|exists:clientes,id',
            'fecha_movimiento' => 'required|date',
            'movimiento_registrado' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ], 400);
        }

        $movimiento->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Movimiento actualizado correctamente',
            'data' => $movimiento
        ], 200);
    }

    /**
     * Elimina un registro de movimiento.
     */
    public function eliminar($id)
    {
        $movimiento = Movimiento::find($id);

        if (!$movimiento) {
            return response()->json([
                'status' => 'error',
                'message' => 'Movimiento no encontrado',
                'statusCode' => 404
            ], 404);
        }

        $movimiento->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Movimiento eliminado correctamente'
        ], 200);
    }
}
