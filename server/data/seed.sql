BEGIN;

-- on vide les tables existantes avec un reset de la numération des id
TRUNCATE TABLE score, player, game RESTART IDENTITY;

INSERT INTO game (date) VALUES
(NOW()-'9 hours'::interval),
(NOW()-'8 hours'::interval),
(NOW()-'7 hours'::interval),
(NOW()-'6 hours'::interval),
(NOW()-'5 hours'::interval),
(NOW()-'4 hours'::interval),
(NOW()-'3 hours'::interval),
(NOW()-'2 hours'::interval),
(NOW()-'1 hours'::interval),
(NOW());

INSERT INTO player (name) VALUES
('Aragorn'),
('Bilbo'),
('Boromir'),
('Frodo'),
('Gandalf'),
('Gimli'),
('Legolas'),
('Merry'),
('Pipin'),
('Sam');

INSERT INTO score(game_id, player_id, points) VALUES
(1, 5, 11),
(1, 9, 5),
(2, 10, 10),
(2, 3, 11),
(3, 2, 11),
(3, 4, 7),
(4, 1, 3),
(4, 8, 11),
(5, 6, 11),
(5, 4, 6),
(6, 3, 8),
(6, 7, 11),
(7, 8, 11),
(7, 5, 4),
(8, 2, 5),
(8, 1, 11),
(9, 4, 11),
(9, 9, 1),
(10, 8, 2),
(10, 7, 11);


COMMIT;