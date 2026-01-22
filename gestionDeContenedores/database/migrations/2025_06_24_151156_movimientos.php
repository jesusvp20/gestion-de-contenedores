<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
      //definimos la tabla de movimientos de los contenedores registrados
        Schema::create('movimientos', function (Blueprint $table){
        $table->id();
        
        $table->foreignId('id_contenedor')->constrained('contenedores')->onDelete('cascade');  
        $table->foreignId('id_ubicacion')->constrained('ubicacion')->onDelete('cascade');  
        $table->date('fecha_movimiento'); 
        $table->string('movimiento_registrado'); 
        $table->foreignId('id_cliente')->constrained('clientes')->onDelete('cascade');   
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       Schema::dropIfExists('movimientos');
    }
};
