import express from 'express'
import { WebSocketServer } from 'ws';

const app = express();

const server = app.listen(3000, () => {
    console.log('Servidor aberto na porta 3000')
})
 
const wss = new WebSocketServer({ server });

let players = {};
let totalPlayers = 0;
let espectadores = {};
let gameStart = false;
let time = 0;
let gameTimeInterval = null;

function generateIdPlayer(){
    return Math.floor(Math.random() * 1000).toString();
}

wss.on('connection', (ws) => {
    ws.on('message', function(event){
        const playerId = generateIdPlayer();
        const data = JSON.parse(event);

        if (data.type === 'connect') {
            totalPlayers++;
            
            if (totalPlayers <= 2) {
                    players[playerId] = {
                        player: totalPlayers,
                        id: playerId,
                        nome: data.name,
                        x: 0,
                        y: 0,
                    }; 
                    ws.send(JSON.stringify({
                        type: 'player',
                        player: players[playerId]
                    }));
            } else if (totalPlayers > 2) {
                espectadores[playerId] = {
                    player: totalPlayers,
                    id: playerId,
                    nome: data.name,
                };
                ws.send(JSON.stringify({
                    type: 'espec',
                    espectadores
                }));
            }
    
            if (totalPlayers >= 2) {
                gameStart = true;
                ws.send(JSON.stringify({
                    type: 'game',
                    gameStart: gameStart,
                    players
                }));
                wss.clients.forEach(client => {
                    if (client.readyState === ws.OPEN) {
                        client.send(JSON.stringify({
                            type: 'game',
                            gameStart: gameStart,
                            players
                        }));

                        if (!gameTimeInterval && gameStart) {
                            gameTimeInterval = setInterval(() => {
                                time++;
                                wss.clients.forEach(client => {
                                    if (client.readyState === ws.OPEN) {
                                        client.send(JSON.stringify({
                                            type: 'time',
                                            time,
                                        }));
                                    }
                                });
                            }, 1000);
                        }
                    }
                });
            }
        }
    
        if (data.type === 'disconnect') {
            console.log(`Player disconnected: ${playerId}`);
            totalPlayers--;
            delete players[data.id]; 
            if (totalPlayers < 2) {
                gameStart = false;
                time = 0;
                wss.clients.forEach(client => {
                    if (client.readyState === ws.OPEN) {
                        client.send(JSON.stringify({
                            type: 'game',
                            gameStart: gameStart
                        }));
                    }
                });
            }
        }

        if(data.type == 'movement'){
            players[data.id].y = data.positionY;
            players[data.id].x = data.positionX;
            ws.send(JSON.stringify({
                type: 'movement',
                players
            }));
        }
        
        console.log(JSON.parse(event));
        console.log('player', players);
        console.log('espectador', espectadores);
        console.log(totalPlayers)
    });

    setInterval(() => {
        const data = {
            totalPlayers,
            movement: {
                type: 'movement',
                players
            },
        };
        ws.send(JSON.stringify(data));
    }, 1000);

    // ws.on('close', function(){
    //     console.log('jogador desconectado');
    //     totalPlayers--;
    //     delete players[playerId];
    //     if(players){
    //         let playersDelete = Object.keys(players);
    //         playersDelete.forEach(function(e){
    //             const numberPlayer = players[e].player - 1;
    //             if(numberPlayer != 0){
    //                 players[e].player = players[e].player - 1
    //             }
    //         })
    //     }
    // });

    // ws.on('message', (message) => {
    //     console.log(`Mensagem recebida do cliente: ${message}`);
        
    //     // Envia uma resposta ao cliente
    //     ws.send('Mensagem recebida no servidor');
    // });
    
    // setTimeout(() => {
    //     ws.send('teste')

    //     setTimeout(() => {
    //         ws.send('teste2')
    //     }, 10000)
    // }, 1000);
});


app.get('/', (req, res) => {
    res.send('teste');
});