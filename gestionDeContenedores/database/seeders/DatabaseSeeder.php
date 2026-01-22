<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\Usuario::create([
            'nombre' => 'Administrador',
            'email' => 'admin@email.com',
            'rol' => 'admin',
            'password' => \Illuminate\Support\Facades\Hash::make('test123'),
        ]);
    }
}
