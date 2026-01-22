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
    public function listar(Request $request)
    {
        $user = $request->user();
        if ($user->rol === 'admin') {
            $movimientos = Movimiento::with(['contenedor', 'ubicacion', 'cliente'])->get();
        } else {
            $movimientos = Movimiento::with(['contenedor', 'ubicacion', 'cliente'])->where('usuario_id', $user->id)->get();
        }
        
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

        $data = $request->all();
        $data['usuario_id'] = $request->user()->id;
        $movimiento = Movimiento::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Movimiento registrado exitosamente',
            'data' => $movimiento
        ], 201);
    }

    /**
     * Busca un movimiento por ID.
     */
    public function buscarMovimiento(Request $request, $id)
    {
        $movimiento = Movimiento::with(['contenedor', 'ubicacion', 'cliente'])->find($id);

        if (!$movimiento) {
            return response()->json([
                'status' => 'error',
                'message' => 'Movimiento no encontrado',
                'statusCode' => 404
            ], 404);
        }

        $user = $request->user();
        if ($user->rol !== 'admin' && $movimiento->usuario_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'No autorizado',
            ], 403);
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

        $user = $request->user();
        if ($user->rol !== 'admin' && $movimiento->usuario_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'No autorizado',
            ], 403);
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
    public function eliminar(Request $request, $id)
    {
        $movimiento = Movimiento::find($id);

        if (!$movimiento) {
            return response()->json([
                'status' => 'error',
                'message' => 'Movimiento no encontrado',
                'statusCode' => 404
            ], 404);
        }

        if ($request->user()->rol !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'No autorizado',
            ], 403);
        }
        $movimiento->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Movimiento eliminado correctamente'
        ], 200);
    }
}
