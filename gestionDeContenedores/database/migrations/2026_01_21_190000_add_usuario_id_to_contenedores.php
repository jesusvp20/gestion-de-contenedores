<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contenedores', function (Blueprint $table) {
            $table->foreignId('usuario_id')->nullable()->constrained('usuarios')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('contenedores', function (Blueprint $table) {
            $table->dropConstrainedForeignId('usuario_id');
        });
    }
};
