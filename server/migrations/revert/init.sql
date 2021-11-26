-- Revert pong:init from pg

BEGIN;

DROP TABLE score, player, game;

COMMIT;
