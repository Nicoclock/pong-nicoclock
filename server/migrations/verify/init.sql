-- Verify pong:init on pg

BEGIN;

SELECT id FROM game WHERE false;
SELECT id FROM player WHERE false;
SELECT id FROM score WHERE false;

ROLLBACK;
