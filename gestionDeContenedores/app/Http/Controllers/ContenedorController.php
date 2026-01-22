<?php

namespace App\Http\Controllers;

use App\Models\Contenedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContenedorController extends Controller
{
    public function listar(Request $request)
    {
        $user = $request->user();
        if ($user->rol === 'admin') {
            $contenedores = Contenedor::with('ubicacion')->get();
        } else {
            $contenedores = Contenedor::with('ubicacion')->where('usuario_id', $user->id)->get();
        }
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

        $data = $request->all();
        $data['usuario_id'] = $request->user()->id;
        $contenedor = Contenedor::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Contenedor creado exitosamente',
            'data' => $contenedor
        ], 201);
    }

    public function encontrar(Request $request, $id)
    {
        $contenedor = Contenedor::with('ubicacion')->find($id);

        if (!$contenedor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Contenedor no encontrado'
            ], 404);
        }

        $user = $request->user();
        if ($user->rol !== 'admin' && $contenedor->usuario_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'No autorizado'
            ], 403);
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

        $user = $request->user();
        if ($user->rol !== 'admin' && $contenedor->usuario_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'No autorizado'
            ], 403);
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

    public function eliminar(Request $request, $id)
    {
        $contenedor = Contenedor::find($id);

        if (!$contenedor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Contenedor no encontrado'
            ], 404);
        }

        if ($request->user()->rol !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'No autorizado'
            ], 403);
        }
        $contenedor->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Contenedor eliminado exitosamente'
        ], 200);
    }
}
