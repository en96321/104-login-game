import FloorSpriteSheet from '/assets/dungeon/tiles/floor/floor_2.png'
import WallSpriteSheet from '/assets/dungeon/tiles/wall/wall_1.png'

export const loadLobby = () => {
  loadSprite("floor", FloorSpriteSheet)
  loadSprite("wall", WallSpriteSheet)

  const map = [
    "xxxxxxxxxx",
    "xxxxxxxxxx",
    "          ",
    "          ",
    "          ",
    "          ",
    "          ",
    "          "
  ]

  const world = addLevel(map, {
    width: 64,
    height: 64,
    " ": () => [
      scale(4),
      sprite("floor")
    ],
    "x": () => [
      scale(4),
      area({
        width: 16,
        height: 16
      }),
      solid(),
      sprite("wall"),
      
    ]
  })

  return world
}