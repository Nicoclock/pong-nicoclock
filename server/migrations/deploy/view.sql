-- Deploy pong:view to pg

BEGIN;

CREATE VIEW scores AS
SELECT 
	s.game_id,
    (SELECT date FROM game WHERE game.id=s.game_id) as date, 
    (SELECT name FROM player WHERE player.id=s.player_id) as joueur1, 
    s.points as score1, 
    (SELECT name FROM player WHERE player.id=score.player_id) as joueur2,
    score.points as score2
FROM score as s
JOIN score ON score.id <> s.id AND score.game_id = s.game_id
WHERE s.id%2 = 1;

COMMIT;
