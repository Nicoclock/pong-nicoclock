-- Verify pong:view on pg

BEGIN;

SELECT score1 FROM scores WHERE false;

ROLLBACK;
