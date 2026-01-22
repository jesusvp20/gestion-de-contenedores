const { Client } = require('pg');

const connectionString = 'postgresql://postgres.omcprrluwsovsjddygky:Hambre12001**@aws-0-us-west-2.pooler.supabase.com:5432/postgres';

const sql = `
-- Drop tables if they exist to start clean (optional, but requested migrations)
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS movimientos CASCADE;
DROP TABLE IF EXISTS contenedores CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS ubicacion CASCADE;

-- Tabla Ubicación
CREATE TABLE IF NOT EXISTS ubicacion (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    fecha_movimiento DATE NOT NULL
);

-- Tabla Contenedores
CREATE TABLE IF NOT EXISTS contenedores (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(255) UNIQUE NOT NULL,
    tipo_contenedor VARCHAR(255) NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    capacidad INTEGER NOT NULL,
    ubicacion_id BIGINT REFERENCES ubicacion(id) ON DELETE SET NULL
);

-- Tabla Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    numero_identificacion BIGINT UNIQUE NOT NULL,
    telefono BIGINT NULL
);

-- Tabla Movimientos
CREATE TABLE IF NOT EXISTS movimientos (
    id BIGSERIAL PRIMARY KEY,
    id_contenedor BIGINT REFERENCES contenedores(id) ON DELETE CASCADE NOT NULL,
    id_ubicacion BIGINT REFERENCES ubicacion(id) ON DELETE CASCADE NOT NULL,
    fecha_movimiento DATE NOT NULL,
    movimiento_registrado VARCHAR(255) NOT NULL,
    id_cliente BIGINT REFERENCES clientes(id) ON DELETE CASCADE NOT NULL
);

-- Tabla Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
     id BIGSERIAL PRIMARY KEY,
     nombre VARCHAR(255) NOT NULL,
     rol VARCHAR(255) DEFAULT 'usuario', 
     password VARCHAR(255) NOT NULL,
     movimiento_id BIGINT REFERENCES movimientos(id) ON DELETE CASCADE
);

-- Insertar usuario de prueba (password: test123)
-- Nota: En una app real usar bcrypt, pero para prueba directa:
INSERT INTO usuarios (nombre, rol, password) VALUES ('Administrador', 'admin', '$2y$12$R.S.h7qS1p1k..YV.L/0O.EOn5R9vQpUvP9wL5k/8K.t0v1V/W1qS') ON CONFLICT DO NOTHING;
`;

async function run() {
    const client = new Client({
        connectionString: connectionString,
    });
    try {
        await client.connect();
        console.log('--- Conectado a Supabase ---');
        await client.query(sql);
        console.log('--- Migraciones ejecutadas exitosamente ---');
        console.log('--- Usuario de prueba creado: admin / test123 ---');
    } catch (err) {
        console.error('Error ejecutando SQL:', err.stack);
    } finally {
        await client.end();
    }
}

run();
