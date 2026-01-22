<?php

namespace App\Http\Controllers;

use App\Models\Ubicacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Controlador para la gestión de ubicaciones.
 */
class UbicacionController extends Controller
{
    /**
     * Lista todas las ubicaciones.
     */
    public function listar()
    {
        $ubicaciones = Ubicacion::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $ubicaciones
        ], 200);
    }

    /**
     * Busca una ubicación por ID.
     */
    public function buscarUbicacion($id)
    {
        $ubicacion = Ubicacion::find($id);

        if (!$ubicacion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ubicación no encontrada',
                'statusCode' => 404
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $ubicacion
        ], 200);
    }

    /**
     * Crea una nueva ubicación.
     */
    public function crear(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'fecha_movimiento' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ], 400);
        }

        // Evitar duplicados por combinación nombre + dirección
        $existe = Ubicacion::where('nombre', $request->nombre)
            ->where('direccion', $request->direccion)
            ->exists();

        if ($existe) {
            return response()->json([
                'status' => 'error',
                'message' => 'La ubicación ya existe con el mismo nombre y dirección'
            ], 409);
        }

        $ubicacion = Ubicacion::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Ubicación creada con éxito',
            'data' => $ubicacion
        ], 201);
    }

    /**
     * Actualiza una ubicación existente.
     */
    public function actualizar(Request $request, $id)
    {
        $ubicacion = Ubicacion::find($id);

        if (!$ubicacion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ubicación no encontrada',
                'statusCode' => 404
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'fecha_movimiento' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ], 400);
        }

        $ubicacion->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Ubicación actualizada con éxito',
            'data' => $ubicacion
        ], 200);
    }

    /**
     * Elimina una ubicación.
     */
    public function eliminar($id)
    {
        $ubicacion = Ubicacion::find($id);

        if (!$ubicacion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ubicación no encontrada',
                'statusCode' => 404
            ], 404);
        }

        $ubicacion->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Ubicación eliminada correctamente'
        ], 200);
    }
}
