<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Controlador para la gestión de clientes.
 */
class ClienteController extends Controller
{
    /**
     * Lista todos los clientes registrados.
     */
    public function listar(Request $request)
    {
        $user = $request->user();
        $clientes = Cliente::where('usuario_id', $user->id)->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $clientes,
        ], 200);
    }

    /**
     * Busca un cliente específico por su ID.
     */
    public function buscarCliente(Request $request, $id)
    {
        $cliente = Cliente::find($id);

        if (!$cliente) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cliente no encontrado',
                'statusCode' => 404,
            ], 404);
        }

        $user = $request->user();
        if ($cliente->usuario_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'No autorizado'
            ], 403);
        }
        return response()->json([
            'status' => 'success',
            'data' => $cliente
        ], 200);
    }

    /**
     * Crea un nuevo cliente en el sistema.
     */
    public function crear(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'telefono' => 'required|string|max:15',
            'numero_identificacion' => 'required|integer|unique:clientes,numero_identificacion',
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
        $cliente = Cliente::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Cliente creado exitosamente',
            'data' => $cliente
        ], 201);
    }

    /**
     * Actualiza la información de un cliente existente.
     */
    public function actualizar(Request $request, $id)
    {
        $cliente = Cliente::find($id);

        if (!$cliente) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cliente no encontrado',
                'statusCode' => 404
            ], 404);
        }

        $user = $request->user();
        if ($user->rol !== 'admin' && $cliente->usuario_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'No autorizado'
            ], 403);
        }
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'telefono' => 'required|string|max:15',
            'numero_identificacion' => 'required|integer|unique:clientes,numero_identificacion,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ], 400);
        }

        $cliente->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Cliente actualizado exitosamente',
            'data' => $cliente
        ], 200);
    }

    /**
     * Elimina un cliente por su ID.
     */
    public function eliminar(Request $request, $id)
    {
        $cliente = Cliente::find($id);

        if (!$cliente) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cliente no encontrado',
                'statusCode' => 404
            ], 404);
        }

        $user = $request->user();
        if ($user->rol !== 'admin' || $cliente->usuario_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'No autorizado'
            ], 403);
        }
        $cliente->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Cliente eliminado exitosamente'
        ], 200);
    }

    /**
     * Obtiene todos los movimientos asociados a un cliente.
     */
    public function buscarMovimientosPorCliente(Request $request, $id)
    {
        $cliente = Cliente::with(['movimientos.contenedor', 'movimientos.ubicacion'])->find($id);

        if (!$cliente) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cliente no encontrado'
            ], 404);
        }

        $user = $request->user();
        if ($user->rol !== 'admin' && $cliente->usuario_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'No autorizado'
            ], 403);
        }
        return response()->json([
            'status' => 'success',
            'data' => [
                'cliente' => $cliente->nombre,
                'movimientos' => $cliente->movimientos
            ]
        ], 200);
    }
}
