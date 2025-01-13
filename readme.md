# The Game

Este projeto é um **jogo multiplayer online** que utiliza **Node.js** e **WebSocket** para permitir a comunicação em tempo real entre os jogadores. O jogo permite que os usuários interajam uns com os outros em tempo real, realizando ações que são enviadas para o servidor via WebSocket e transmitidas para todos os jogadores conectados.

## Funcionalidades

- Comunicação em tempo real via WebSocket.
- Conexão e desconexão de jogadores em tempo real.
- Interações entre jogadores, como realizar ações no jogo, atirar, vencedor e perdedor.
- Simples e eficiente para jogos em que o tempo de resposta é crucial.
- Sistema de expectadores e jogadores, com o máximo de jogadores permitido sendo 2.

## Tecnologias Utilizadas

- **Node.js**: Plataforma para rodar o servidor.
- **WebSocket**: Protocolo de comunicação em tempo real entre cliente e servidor.
- **Express**: Framework web para facilitar a criação do servidor HTTP.
- **HTML/CSS/JavaScript (vanilla)**: Front-end simples para interação com o jogo.

## Pré-requisitos

Antes de rodar o projeto, você precisa ter o **Node.js** instalado em sua máquina. Você pode baixá-lo em [https://nodejs.org](https://nodejs.org).

## Como Funciona?
- 1. Back-End (Node.js + WebSocket)
O back-end é responsável por gerenciar a comunicação em tempo real entre os clientes (jogadores). Ele usa o WebSocket para permitir que os jogadores enviem ações ou mensagens em tempo real para o servidor, que, por sua vez, distribui essas ações para todos os jogadores conectados.

O servidor é inicializado com Express, e o WebSocket é usado para a comunicação bidirecional em tempo real.

- 2. Front-End (HTML + CSS + JavaScript)
No lado do cliente, o jogo é simples, com uma interface em HTML e estilização básica em CSS. A lógica de comunicação com o servidor é feita através de WebSocket no JavaScript, onde as ações dos jogadores são enviadas para o servidor e os estados do jogo são recebidos e atualizados em tempo real.

## Autores
- Márcio Piva Junior
- Email: marciopivajunior457@gmail.com

