import { Direction } from "../system/direction"
import KnightSpriteSheet from "/assets/dungeon/heroes/knight/knight_spritesheet.png"

export const Status = {
  Run: 'run',
  Idle: 'idle'
}
export const Facing = {
  Left: true,
  Right: false
}

export default class Knight {
  config = {
    width: 16,
    height: 16,
    scale: 4,
    title: {
      size: 24,
      offset: {
        x: -8,
        y: -8
      }
    }
  }
  constructor ({ x = 100, y = 100, title = "you", status = Status.Idle, facing = Facing.Right, isUser = false }) {
    this.status = status
    this.facing = facing
    this.moveSpeed = 320
    loadSprite("knight", KnightSpriteSheet, {
      sliceX: 6,
      sliceY: 2,
      anims: {
        [Status.Idle]: {
          from: 0,
          to: 5,
          loop: true,
          speed: 5
        },
        [Status.Run]: {
          from: 6,
          to: 11,
          loop: true,
          speed: 5
        }
      }
    })

    this.character = add([
      sprite("knight"),
      pos(x, y),
      area({
        width: this.config.scaleWidth,
        height: this.config.scaleHeight
      }),
      solid(),
      scale(this.config.scale),
      isUser ? "user" : "otherUser"
    ])
    this.character.onUpdate(() => {
      if (this.character.isColliding) {
        this.title.pos.x = this.character.pos.x + this.config.title.offset.x
        this.title.pos.y = this.character.pos.y + this.config.title.offset.y
      }
      if (this.character.pos.x < 0) {
        this.character.pos.x = 0
        this.title.pos.x = this.config.title.offset.x
      }
      if (this.character.pos.x > width() - this.scaleWidth) {
        this.character.pos.x = width() - this.scaleWidth
        this.title.pos.x = this.character.pos.x + this.config.title.offset.x
      }
      if (this.character.pos.y < 0) {
        this.character.pos.y = 0
        this.title.pos.y = this.config.title.offset.y
      }
      if (this.character.pos.y > height() - this.scaleHeight) {
        this.character.pos.y = height()  - this.scaleHeight
        this.title.pos.y = this.character.pos.y + this.config.title.offset.y
      }

    })
    this.title = add([
      pos(x + this.config.title.offset.x, y + this.config.title.offset.y),
      text(title, {
        size: this.config.title.size
      })
    ])
    this.character.play(Status.Idle)
  }

  get scaleWidth () {
    return this.config.width * this.config.scale
  }

  get scaleHeight () {
    return this.config.height * this.config.scale
  }

  set ({ x, y, status, facing }) {
    this.status = status,
    this.character.pos.x = x
    this.character.pos.y = y
    this.title.pos.x = x + this.config.title.offset.x
    this.title.pos.y = y + this.config.title.offset.y
    this.character.flipX(facing)
  }

  remove () {
    destroy(this.character)
    destroy(this.title)
  }

  move (direction) {
    if (this.status != Status.Run) {
      this.status = Status.Run
      this.character.play(Status.Run)
    }
    const characterMove = {
      [Direction.Down]: () => {
        this.title.move(0, this.moveSpeed)
        this.character.move(0, this.moveSpeed)
      },
      [Direction.Up]: () => {
        this.title.move(0, -this.moveSpeed)
        this.character.move(0, -this.moveSpeed)
      },
      [Direction.Left]: () => {
        this.facing = Facing.Left
        this.character.flipX(Facing.Left)
        this.title.move(-this.moveSpeed, 0)
        this.character.move(-this.moveSpeed, 0)
      },
      [Direction.Right]: () => {
        this.facing = Facing.Right
        this.title.move(this.moveSpeed, 0)
        this.character.flipX(Facing.Right)
        this.character.move(this.moveSpeed, 0)
      }
    }
    characterMove[direction]()
  }
  
  idle () {
    this.status = Status.Idle
    this.character.play(Status.Idle)
  }
} 