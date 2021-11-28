-- Deploy pong:functions to pg

BEGIN;

CREATE TYPE scores_by_player AS (
	game_id INT,
	date TIMESTAMPTZ,
	joueur TEXT,
	score1 INT,
	adversaire TEXT,
	score2 INT
);

CREATE FUNCTION scores_for(INT) RETURNS SETOF scores_by_player AS $$

	SELECT game_id, date, joueur1 as joueur, score1, joueur2 as adversaire, score2
	FROM scores
	WHERE joueur1=(SELECT name FROM player WHERE id=$1)
	UNION
	SELECT game_id, date, joueur2, score2, joueur1 as adversaire, score1
	FROM scores
	WHERE joueur2=(SELECT name FROM player WHERE id=$1)

$$ LANGUAGE SQL STRICT;


CREATE FUNCTION new_game() RETURNS INT AS $$
	INSERT INTO game(date) VALUES(NOW()) RETURNING id
$$ LANGUAGE SQL STRICT;

CREATE FUNCTION first_score(json) RETURNS INT AS $$
	INSERT INTO score (game_id, player_id, points) VALUES (
			new_game(),
			($1->>'joueur2')::int,
			($1->>'score2')::int
	) RETURNING game_id;
$$ LANGUAGE SQL STRICT;

-- ajout des scores à la fin de la partie

-- json attendu
-- {
-- 	"joueur1": int,
-- 	"joueur2": int,
-- 	"score1": int,
-- 	"score2": int
-- }

CREATE FUNCTION add_score(json) RETURNS int AS $$
	INSERT INTO score (game_id, player_id, points) VALUES(
		first_score($1),
		($1->>'joueur1')::int,
		($1->>'score1')::int
	) RETURNING game_id;
$$ LANGUAGE SQL STRICT;


COMMIT;
