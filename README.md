# Pong

Version JavaScript de l'un des tout premiers jeux vidéo  
Il s'agit d'un ping-pong virtuelen 11 points

## Stack technique

Postgresql
Sqitch
NodeJS
ReactJS

## Installation

createdb pong


cd ./client; npm install; npm run build
cd ../server; 
sqitch deploy
psql -f seed.sql

sqitch.conf.example -> sqitch.conf
.env.example -> .env

npm install; cp -R ../client/build/* ./public
npm start

doc de l'API
{host}/api-docs