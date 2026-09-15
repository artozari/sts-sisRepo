-- Relación: casino -> mesa
-- Un casino tiene varias mesas (table_table.fk_casino),
-- una mesa tiene una configuración (table_table.fk_config) y
-- una configuración puede estar en varias mesas.
-- Se elimina la relación casino -> config (config_table.fk_casino).

ALTER TABLE public.table_table
    ADD COLUMN IF NOT EXISTS fk_casino INTEGER REFERENCES public.casino_table(id);

-- Copiar el casino de la configuración de cada mesa hacia la mesa
UPDATE public.table_table t
SET fk_casino = c.fk_casino
FROM public.config_table c
WHERE c.id = t.fk_config
  AND t.fk_casino IS NULL
  AND c.fk_casino IS NOT NULL;

-- Aplicar NOT NULL solo si no quedan mesas sin casino
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.table_table WHERE fk_casino IS NULL) THEN
        ALTER TABLE public.table_table ALTER COLUMN fk_casino SET NOT NULL;
    END IF;
END $$;

-- Quitar la relación casino -> config
ALTER TABLE public.config_table
    DROP COLUMN IF EXISTS fk_casino;
