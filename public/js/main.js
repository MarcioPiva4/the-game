const buttonPlay = document.querySelector('#play');
const buttonConfig = document.querySelector('#config');
const buttonBack = document.querySelector('#back');
const player1 = document.querySelector('.player-1');
const player2 = document.querySelector('.player-2');
const namePlayer1 = document.querySelector('.name-player-1');
const namePlayer2 = document.querySelector('.name-player-2');
const time = document.querySelector('.time');
// Conectar ao WebSocket do servidor
const socket = new WebSocket('ws://localhost:3000');
sessionStorage.clear();

let player = JSON.parse(sessionStorage.getItem('player'));
let gameStart;

let positionX = 0;
let positionY = 0;
let speed = 20;
let isMoving = false;
let isEspectation;
// Evento quando a conexão é aberta
socket.addEventListener('open', function (event) {
  console.log('Conectado ao WebSocket');
});

// Evento quando uma mensagem é recebida
socket.addEventListener('message', function (event) {
  const data = JSON.parse(event.data);
  if (data.type == 'time') {
    let timeData = data.time;
    let minutes = Math.floor(timeData / 60);
    let seconds = timeData % 60;
    time.innerHTML = `<span>${minutes.toString().length == 1 ? '0' + minutes : minutes}</span> : <span>${seconds.toString().length == 1 ? '0' + seconds : seconds}</span>`;
  }

  if (data.player && data.type == 'player') {
    player = data.player;
    if (sessionStorage.getItem('player')) {
      sessionStorage.removeItem('player');
    }
    sessionStorage.setItem('player', JSON.stringify(data));
  }
  document.querySelector('.connects').textContent = data.totalPlayers

  if (data.type == 'espec') {
    isEspectation = true;
  }

  if (isEspectation && data.movement !== undefined && data.movement.type == 'movement') {
    const playersArray = Object.keys(data.movement.players);
    playersArray.forEach((e) => {
      const players = data.movement.players[e];
      if (players.player == 1) {
        player1.style.left = `${players.x}px`
        player1.style.top = `${players.y}px`
      }

      if (players.player == 2) {
        player2.style.top = `${players.y}px`
        player2.style.right = `${players.x}px`
      }
    })
  }

  if (data.type == 'game' && player || isEspectation) {
    gameStart = data.gameStart;
    const players = Object.entries(data.players);

    players.forEach(([key, value]) => {
      console.log(value.nome)
      value.player === 1 ? namePlayer1.textContent = value.nome : namePlayer2.textContent = value.nome;
    })
  }


  const isPlayer = player && player.player == 1 ? player1 : player2;
  if (gameStart) {
    function sendPosition(positionX, positionY) {
      socket.send(JSON.stringify({
        id: player.id,
        player: player.player,
        type: 'movement',
        positionX,
        positionY
      }));
    }
    document.querySelector('.game-section-menu').classList.add('hidden-animation-top');
    document.querySelector('.game-section').style.display = 'block';
    if (!isEspectation) {
      document.addEventListener('keydown', function (e) {
        if (!isMoving) {
          isMoving = true;
          if (e.key === 'w') {
            positionY -= speed;
            isPlayer.style.top = `${positionY}px`;
            sendPosition(positionX, positionY);
          };
          if (e.key === 's') {
            positionY += speed;
            isPlayer.style.top = `${positionY}px`;
            sendPosition(positionX, positionY);
          };
          if (e.key === 'a') {
            if (player.player == 1) {
              positionX -= speed;
              isPlayer.style.left = `${positionX}px`
              sendPosition(positionX, positionY);
            } else {
              positionX += speed;
              isPlayer.style.right = `${positionX}px`
              sendPosition(positionX, positionY);
            }
          };
          if (e.key === 'd') {
            if (player.player == 1) {
              positionX += speed;
              isPlayer.style.left = `${positionX}px`
              sendPosition(positionX, positionY);
            } else {
              positionX -= speed;
              isPlayer.style.right = `${positionX}px`
              sendPosition(positionX, positionY);
            }
          };
        }
      })
      document.addEventListener('keyup', function (e) {
        if (e.key === 'w' || e.key === 's' || e.key === 'a' || e.key === 'd') {
          isMoving = false;
        }
      });
    }
  }

  if (!gameStart) {
    document.querySelector('.game-section-menu').classList.remove('hidden-animation-top');
    document.querySelector('.game-section').style.display = 'none';
  }

  if (data.movement !== undefined && data.movement.type == 'movement' && player) {
    const playersArray = Object.keys(data.movement.players);
    const playersArrayFiltered = playersArray.filter((e) => e != player.id);
    if (playersArrayFiltered[0] !== player.id) {
      const otherPlayer = data.movement.players[playersArrayFiltered[0]];
      if (otherPlayer !== undefined && otherPlayer.player === 1) {
        player1.style.left = `${otherPlayer.x}px`
        player1.style.top = `${otherPlayer.y}px`
      }

      if (otherPlayer !== undefined && otherPlayer.player === 2) {
        player2.style.top = `${otherPlayer.y}px`
        player2.style.right = `${otherPlayer.x}px`
      }
    }
  }
});

window.addEventListener('beforeunload', () => {
  socket.send(JSON.stringify({
    type: 'disconnect',
    id: player.id,
  }));
});

socket.addEventListener('close', function () {
  socket.send(JSON.stringify({
    type: 'disconnect',
    id: player.id,
  }));
})

buttonPlay.addEventListener('click', function () {
  const name = document.querySelector('#name').value;
  if (!player) {
    if (name.length <= 0) {
      window.alert('Por favor insira um nome');
      return
    }
    socket.send(JSON.stringify({
      type: 'connect',
      name,
    }));
  }
});

buttonConfig.addEventListener('click', function() {
  document.querySelector('.game-section-menu').style.display = 'none';
  document.querySelector('.game-section-menu-config').style.display = 'block';
});

buttonBack.addEventListener('click', function(){
  document.querySelector('.game-section-menu').style.display = 'block';
  document.querySelector('.game-section-menu-config').style.display = 'none';
});

document.addEventListener('click', function () {
  const gameDiv = document.querySelector('.game');
  const isPlayer = player && player.player == 1 ? player1 : player2;
  const positionBottom = isPlayer.classList.contains('player-1') ? isPlayer.getBoundingClientRect().bottom : isPlayer.getBoundingClientRect().bottom;
  const positionTop = isPlayer.classList.contains('player-1') ? isPlayer.getBoundingClientRect().top + 40 : isPlayer.getBoundingClientRect().top + 40;
  const positionRight = isPlayer.getBoundingClientRect().right;
  const positionLeft = isPlayer.classList.contains('player-1') ? isPlayer.getBoundingClientRect().left + 105 : isPlayer.getBoundingClientRect().left - 23;

  const element = document.createElement('div');
  isPlayer.classList.contains('player-1') ? element.classList.add('projectile-1') : element.classList.add('projectile-2');
  element.style.right = `${positionRight}px`;
  element.style.left = `${positionLeft}px`;
  element.style.top = `${positionTop}px`;
  element.style.bottom = `${positionBottom}px`;
  gameDiv.append(element);
  isPlayer.classList.contains('player-1') ? 
  anime({
    targets: element,
    translateX: 1000,
    duration: 1500, 
    easing: 'linear',
    complete: function () {
      gameDiv.removeChild(element);
    }
  })
  :
  anime({
    targets: element,
    translateX: -1050,
    duration: 1500,
    easing: 'linear',
    complete: function () {
      gameDiv.removeChild(element);
    }
  });
});

document.addEventListener('DOMContentLoaded', function(){
  const title = document.querySelector('.title');
  const text = title.innerText;
  title.innerHTML = '';

  text.split('').forEach(letter => {
    const span = document.createElement('span');
    span.innerText = letter;
    span.classList.add('letter');
    title.appendChild(span);
  });

  anime({
    targets: '.letter',
    opacity: [0, 1],
    scale: [0.5, 1], 
    color: ['#e74c3c', '#fff'],
    duration: 1000,
    easing: 'easeOutQuad', 
    delay: anime.stagger(100, {start: 500}),
  });
});