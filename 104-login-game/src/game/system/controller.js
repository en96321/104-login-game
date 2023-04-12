import { Direction } from "./direction";

export const useCharacterController = (character, hook = () => {} ) => {
  onKeyDown(Direction.Down, () => {
    character.move(Direction.Down)
    hook()
  })
  onKeyDown(Direction.Up, () => {
    character.move(Direction.Up)
    hook()
  })
  onKeyDown(Direction.Right, () => {
    character.move(Direction.Right)
    hook()
  })
  onKeyDown(Direction.Left, () => {
    character.move(Direction.Left)
    hook()
  })

  onKeyRelease([Direction.Down, Direction.Up, Direction.Left, Direction.Right], () => {
    character.idle()
    hook()
  })
}