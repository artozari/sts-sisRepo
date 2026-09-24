-- Creamos la función RPC para insertar múltiples juegos
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
