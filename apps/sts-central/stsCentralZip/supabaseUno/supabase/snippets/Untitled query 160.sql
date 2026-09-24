SELECT relname, relkind FROM pg_class WHERE relname IN ('game_table','game_table_old');
SELECT proname FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND proname IN ('create_game_table_partition','insertar_juegos');
SELECT public.create_game_table_partition(to_char(now(), 'YYYY-MM-01')::date);