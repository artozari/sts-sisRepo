-- Esquema completo + permisos para los roles de la API (anon, authenticated, service_role)

-- Usuarios
CREATE TABLE IF NOT EXISTS user_table (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Perfiles
CREATE TABLE IF NOT EXISTS profile_table (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES user_table(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS casino_table(
  id serial not null,
  nombre text,
  primary key(nombre),
  constraint casino_table_id_key unique (id)
);

-- Configuración
CREATE TABLE IF NOT EXISTS config_table (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT,
  wheel_type TEXT NOT NULL DEFAULT 'FR37',
  skin TEXT NOT NULL DEFAULT 'BOX',
  skin2 TEXT NOT NULL DEFAULT 'BALL',
  skin3 TEXT NOT NULL DEFAULT 'LIGHT_NEON_PINK',
  skin4 TEXT NOT NULL DEFAULT 'CHINESE_96',
  skin5 TEXT NOT NULL DEFAULT 'RACING',
  skin6 TEXT NOT NULL DEFAULT 'OFF',
  skin7 TEXT NOT NULL DEFAULT 'OFF',
  skin8 TEXT NOT NULL DEFAULT 'OFF',
  lang TEXT NOT NULL DEFAULT 'es',
  lang2 TEXT NOT NULL DEFAULT 'OFF',
  lang3 TEXT NOT NULL DEFAULT 'OFF',
  croupier_lang TEXT NOT NULL DEFAULT 'es',
  croupier_lang2 TEXT NOT NULL DEFAULT 'OFF',
  croupier_lang3 TEXT NOT NULL DEFAULT 'OFF',
  skin_rotation_time INTEGER NOT NULL DEFAULT 60,
  statistics_q INTEGER NOT NULL DEFAULT 200,
  color_of_lights TEXT NOT NULL DEFAULT 'yellow',
  lights_intensity INTEGER NOT NULL DEFAULT 1,
  semaphore_intensity INTEGER NOT NULL DEFAULT 1,
  semaphore_time INTEGER NOT NULL DEFAULT 15,
  semaphore_green INTEGER NOT NULL DEFAULT 4,
  semaphore_yellow INTEGER NOT NULL DEFAULT 2,
  b32 INTEGER,
  b33 INTEGER,
  b34 INTEGER,
  b35 INTEGER,
  b36 INTEGER,
  b37 INTEGER,
  b38 INTEGER,
  b39 INTEGER,
  bch1 INTEGER,
  bch2 INTEGER,
  bch3 INTEGER,
  bch4 INTEGER,
  fk_casino INTEGER REFERENCES casino_table(id),
  user_id INTEGER REFERENCES user_table(id)
);

-- Mesas
CREATE TABLE IF NOT EXISTS table_table (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  pos_x INTEGER NOT NULL DEFAULT -1,
  pos_y INTEGER NOT NULL DEFAULT -1,
  layout INTEGER NOT NULL DEFAULT 0,
  no_smoking BOOLEAN NOT NULL DEFAULT TRUE,
  table_number INTEGER NOT NULL DEFAULT 0,
  fk_config INTEGER,
  last_game_registered INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_config_reference FOREIGN KEY (fk_config) REFERENCES config_table(id)
);

-- Juegos
CREATE TABLE IF NOT EXISTS game_table (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  workday DATE,
  game_number INTEGER NOT NULL,
  win_number INTEGER,
  rpm INTEGER,
  open_table BOOLEAN,
  clockwise BOOLEAN NOT NULL,
  enabled BOOLEAN,
  fk_croupier INTEGER REFERENCES user_table(id),
  fk_table INTEGER NOT NULL REFERENCES table_table(id),
  UNIQUE (fk_table, created_at, game_number)
);

-- Función RPC para insertar juegos (con upsert)
CREATE OR REPLACE FUNCTION public.insertar_juegos(j JSONB)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.game_table (
        created_at,
        updated_at,
        workday,
        game_number,
        win_number,
        rpm,
        open_table,
        clockwise,
        enabled,
        fk_croupier,
        fk_table
    )
    SELECT
        to_timestamp((elem->>'created_at')::BIGINT / 1000),
        to_timestamp((elem->>'updated_at')::BIGINT / 1000),
        (elem->>'workday')::DATE,
        (elem->>'game_number')::INT,
        (elem->>'win_number')::INT,
        (elem->>'rpm')::INT,
        (elem->>'open_table')::BOOLEAN,
        (elem->>'clockwise')::BOOLEAN,
        (elem->>'enabled')::BOOLEAN,
        (elem->>'fk_croupier')::INT,
        (elem->>'fk_table')::INT
    FROM jsonb_array_elements(j) AS elem
    ON CONFLICT (fk_table, created_at, game_number)
    DO UPDATE SET
        updated_at = EXCLUDED.updated_at,
        win_number = EXCLUDED.win_number,
        rpm = EXCLUDED.rpm,
        open_table = EXCLUDED.open_table,
        clockwise = EXCLUDED.clockwise,
        enabled = EXCLUDED.enabled,
        fk_croupier = EXCLUDED.fk_croupier;
END;
$$;

-- Permisos sobre el esquema y sus objetos para los roles de la API
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

-- RLS en game_table con políticas para anon y authenticated
ALTER TABLE public.game_table ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insertar_jugadas" ON public.game_table;
DROP POLICY IF EXISTS "insertar_jugadas_anon" ON public.game_table;
DROP POLICY IF EXISTS "leer_jugadas" ON public.game_table;

CREATE POLICY "insertar_jugadas" ON public.game_table
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "insertar_jugadas_anon" ON public.game_table
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "leer_jugadas" ON public.game_table
  FOR SELECT TO anon, authenticated USING (true);
