import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

enum PlayerStatus {
  Idle = 'idle',
  Run = 'run'
}

const Facing = {
  Left: true,
  Right: false
}

const World = {
  Width: 640,
  Height: 480,
  Base: 128
}

export class Player extends Schema {
  @type("string")
  username = ""

  @type("number")
  x = Math.floor(Math.random() * World.Width);

  @type("number")
  y = Math.floor(Math.random() * World.Height + World.Base);

  @type("string")
  status = PlayerStatus.Idle

  @type("boolean")
  facing = Facing.Right
}

export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  createPlayer(sessionId: string) {
    this.players.set(sessionId, new Player());
  }

  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }

  setPlayer (sessionId: string, { x, y, status, facing }: { x: number, y: number, status: PlayerStatus, facing: boolean }) {
    this.players.get(sessionId).x = x
    this.players.get(sessionId).y = y
    this.players.get(sessionId).status = status
    this.players.get(sessionId).facing = facing
  }
}

export class GameRoom extends Room<State> {
  maxClients = 20;

  onCreate (options) {
    console.log("GameRoom created!", options);

    this.setState(new State());

    this.onMessage('move', (client, data) => {
      this.state.setPlayer(client.sessionId, data);
    });
    this.onMessage('attack', (client, data) => {
      this.broadcast("attack", { id: client.sessionId, data })
    })
  }

  onAuth(client, options, req) {
    return true
  }

  onJoin (client: Client) {
    this.state.createPlayer(client.sessionId);
  }

  onLeave (client) {
    this.state.removePlayer(client.sessionId);
  }

  onDispose () {
    console.log("Dispose GameRoom");
  }

}
