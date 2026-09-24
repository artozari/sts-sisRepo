-- Permitir uso del esquema
GRANT USAGE ON SCHEMA public TO authenticated;

-- Permitir acceso a todas las tablas del esquema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;

-- Permitir acceso a todas las funciones del esquema
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Permitir acceso a todas las secuencias (si usás SERIAL/BIGSERIAL)
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
