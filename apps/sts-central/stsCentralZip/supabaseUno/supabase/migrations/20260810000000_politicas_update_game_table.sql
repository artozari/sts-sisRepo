-- Agrega UPDATE a las políticas RLS existentes de game_table.
-- La RPC insertar_juegos hace INSERT ... ON CONFLICT DO UPDATE y corría como
-- anon (SECURITY INVOKER); sin política de UPDATE, la rama DO UPDATE era
-- bloqueada por RLS (42501). Se convierten las políticas existentes a FOR ALL
-- (cubre SELECT, INSERT, UPDATE y DELETE).

ALTER TABLE public.game_table ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insertar_jugadas" ON public.game_table;
DROP POLICY IF EXISTS "insertar_jugadas_anon" ON public.game_table;
DROP POLICY IF EXISTS "leer_jugadas" ON public.game_table;

CREATE POLICY "insertar_jugadas" ON public.game_table
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "insertar_jugadas_anon" ON public.game_table
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "leer_jugadas" ON public.game_table
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
