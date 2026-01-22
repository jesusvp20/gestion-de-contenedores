<?php

namespace App\Http\Controllers;

use App\Models\Contenedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContenedorController extends Controller
{
    public function listar()
    {
        $contenedores = Contenedor::with('ubicacion')->get();
        return response()->json([
            'status' => 'success',
            'data' => $contenedores
        ], 200);
    }

    public function crear(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'codigo' => 'required|string|unique:contenedores',
            'tipo_contenedor' => 'required|string',
            'capacidad' => 'required|integer',
            'estado' => 'boolean',
            'ubicacion_id' => 'nullable|exists:ubicacion,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ], 400);
        }

        $contenedor = Contenedor::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Contenedor creado exitosamente',
            'data' => $contenedor
        ], 201);
    }

    public function encontrar($id)
    {
        $contenedor = Contenedor::with('ubicacion')->find($id);

        if (!$contenedor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Contenedor no encontrado'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $contenedor
        ], 200);
    }

    public function actualizar(Request $request, $id)
    {
        $contenedor = Contenedor::find($id);

        if (!$contenedor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Contenedor no encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'tipo_contenedor' => 'string',
            'capacidad' => 'integer',
            'estado' => 'boolean',
            'ubicacion_id' => 'nullable|exists:ubicacion,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ], 400);
        }

        $contenedor->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Contenedor actualizado exitosamente',
            'data' => $contenedor
        ], 200);
    }

    public function eliminar($id)
    {
        $contenedor = Contenedor::find($id);

        if (!$contenedor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Contenedor no encontrado'
            ], 404);
        }

        $contenedor->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Contenedor eliminado exitosamente'
        ], 200);
    }
}
