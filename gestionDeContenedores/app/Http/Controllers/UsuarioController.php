<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

/**
 * Controlador para la gestión de usuarios y autenticación.
 */
class UsuarioController extends Controller
{
    /**
     * Lista todos los usuarios.
     */
    public function listar()
    {
        $usuarios = Usuario::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $usuarios
        ], 200);
    }

    /**
     * Busca un usuario por ID.
     */
    public function buscarUsuario($id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuario no encontrado',
                'statusCode' => 404
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $usuario
        ], 200);
    }

    public function registrar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:usuarios,email',
            'password' => 'required|string|min:6',
            'rol' => 'required|string|in:admin,usuario',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ], 400);
        }

        $usuario = Usuario::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'rol' => $request->rol,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Usuario registrado exitosamente',
            'data' => $usuario
        ], 201);
    }

    /**
     * Inicia sesión de un usuario.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Credenciales inválidas',
                'errors' => $validator->errors()
            ], 400);
        }

        $usuario = Usuario::where('nombre', $request->nombre)
            ->orWhere('email', $request->nombre)
            ->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuario o contraseña incorrectos',
                'statusCode' => 401
            ], 401);
        }

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Bienvenido ' . $usuario->nombre,
            'data' => $usuario,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 200);
    }

    /**
     * Recuperación de contraseña (Simulado).
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:usuarios,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'El correo electrónico no está registrado',
            ], 404);
        }

        // Aquí se enviaría un correo en una app real
        return response()->json([
            'status' => 'success',
            'message' => 'Se ha enviado un enlace de recuperación a su correo electrónico',
        ], 200);
    }

    /**
     * Cierra la sesión del usuario.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Sesión cerrada correctamente'
        ], 200);
    }
}
