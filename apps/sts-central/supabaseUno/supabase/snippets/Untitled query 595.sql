INSERT INTO game_table (
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
VALUES (
  NOW(),
  NOW(),
  '2026-08-05',
  101,
  NULL,
  NULL,
  FALSE,
  TRUE,
  TRUE,
  3,
  1
);
