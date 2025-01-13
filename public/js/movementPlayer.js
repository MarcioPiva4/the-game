function sendPosition(positionX, positionY) {
    socket.send(JSON.stringify({
      id: player.id,
      player: player.player,
      type: 'movement',
      positionX,
      positionY
    }));
}

export function movementPlayer(){
    
}