import SwordSpriteSheet from "/assets/dungeon/heroes/knight/weapon_sword_1.png"

const SwordSpeed = 500

const Offset = {
  X: 8,
  Y: 16
}

export const useAttackSystem = (player, hook = () => {}) => {
  loadSprite("sword", SwordSpriteSheet)
  onKeyPress("space", () => {
    fire({
      pos: player.character.pos,
      facing: player.facing,
      fromMe: true
    })
    hook(player.facing)
  })
}

export const fire = ({ pos: { x, y }, facing, fromMe = false }, hook = () => {}) => {
  
  const direction = facing ? new vec2(-1, 0) : new vec2(1, 0)
  const sword = add([
    sprite("sword"),
    pos(x + Offset.X, y + Offset.Y),
    move(direction, SwordSpeed),
    scale(2),
    area({
      width: 16,
      height: 16
    })
  ])
  sword.onCollide("user", player => {
    if (!fromMe) {
      sword.destroy()
      hook(player)
    }
  })
  sword.onCollide("otherUser", player => {
    if (fromMe) {
      sword.destroy()
      hook(player)
    }
  })
  sword.flipX(facing)
  sword.onUpdate(() => {
    if (sword.pos.x < 0 || sword.pos.x > width()) {
      sword.destroy()
    }
  })
}