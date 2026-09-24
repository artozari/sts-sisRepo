-- Vincular casino_table con el resto del esquema
-- casino_table tiene PK sobre nombre, por eso primero garantizamos unicidad en id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'casino_table_id_key' AND conrelid = 'public.casino_table'::regclass
  ) THEN
    ALTER TABLE public.casino_table ADD CONSTRAINT casino_table_id_key UNIQUE (id);
  END IF;
END $$;

ALTER TABLE public.config_table ADD COLUMN IF NOT EXISTS fk_casino INTEGER REFERENCES public.casino_table(id);
