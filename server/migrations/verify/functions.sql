-- Verify pong:functions on pg

BEGIN;

SELECT * FROM scores_for(NULL);

ROLLBACK;
