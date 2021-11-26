-- Revert pong:functions from pg

BEGIN;

DROP FUNCTION add_score(json);
DROP FUNCTION first_score(json);
DROP FUNCTION new_game();
DROP FUNCTION scores_for(INT);

DROP TYPE scores_by_player;

COMMIT;
