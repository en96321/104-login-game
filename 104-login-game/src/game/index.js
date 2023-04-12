import kaboom from "kaboom";
import * as Colyseus from 'colyseus.js'
import Knight from './character/knight.js'
import { useCharacterController } from "./system/controller.js";
import { World } from "./system/world.js";
import { loadLobby } from "./map/Lobby.js";
import { fire, useAttackSystem } from "./system/attack.js";


export const loadGame = element => {
  const client = new Colyseus.Client("ws://localhost:3000")
  const players = {}
  client.joinOrCreate("GameRoom").then(room => {
    kaboom({
      width: World.width,
      height: World.height,
      canvas: document.querySelector(element)
    })
    const world = loadLobby()

    debug.inspect = false
    players[room.sessionId] = new Knight({ x: 100, y: 100, title: room.sessionId, isUser: true })
    useCharacterController(players[room.sessionId], () => {
      room.send("move", { x: players[room.sessionId].character.pos.x, y: players[room.sessionId].character.pos.y, status: players[room.sessionId].status, facing: players[room.sessionId].facing })
    })
    useAttackSystem(players[room.sessionId], (facing) => {
      room.send("attack", { pos: players[room.sessionId].character.pos, facing })
    })

    room.onMessage('attack', ({ id, data: { pos, facing } }) => {
      fire({
        pos,
        facing
      }, () => {
        room.send("hit")
      })
    })

    room.state.players.onAdd = (player, sessionId) => {
      if (room.sessionId !== sessionId) {
        const avatar = new Knight({ x: player.x, y: player.y, title: sessionId, status: player.status })
        players[sessionId] = avatar
        player.onChange = changes => {
          console.log(player)
          avatar.set(player)
        }
      } else {
        players[sessionId].set(player)
      }
    }

    room.state.players.onRemove = (player, sessionId) => {
      players[sessionId].remove()
      delete players[sessionId]
    }
  })
}
