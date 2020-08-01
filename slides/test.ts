interface Position {
    x: number,
    y: number
}

class Player {
  public update(pos: Position, delta: number): Position {
    pos.x += pos.x * delta;
    pos.y += pos.y * delta;

    return pos;
  }
}

class Mario extends Player {
  public update(pos: Position, delta: number): Position {
    if (pos.x < 0) {
      throw new Error("Can't move out of bounds");
    }

    pos.x += pos.x * delta;
    pos.y += pos.y * delta;

    return pos;
  }
}

let player = new Player()
console.log(player.update({x: -1, y: -1} as Position, 1))

let mario = new Mario()
console.log(mario.update({x: -1, y: -1} as Position, 1))