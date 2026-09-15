ALTER TABLE public.game_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY insertar_jugadas
ON public.game_table
FOR INSERT
TO authenticated
USING (true);
