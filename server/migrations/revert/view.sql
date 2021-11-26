-- Revert pong:view from pg

BEGIN;

DROP VIEW scores;

COMMIT;
