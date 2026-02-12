const gameboard = (() => {
  const boardArr = [[], [], []];
  for (const row of boardArr) {
    for (let i = 0; i < 3; i++) {
      row.push(null);
    }
  }

  const place = (value, position) => {
    if (boardArr[position.y][position.x] === null) {
      boardArr[position.y][position.x] = value;
      return checkForWinner();
    }
  };

  const clearBoard = () =>
    boardArr.forEach((row) => row.forEach((item) => (item = null)));

  const checkRows = () => {
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const value = boardArr[y][x];
        if (
          (value === boardArr[y].at(x - 1) && value === boardArr[y].at(x - 2)) ||
          (value === boardArr.at(y - 1)[x] && value === boardArr.at(y - 2)[x])
        ) {
          return value;
        }
      }
    }
  };

  const checkDiagonals = () => {
    const centerValue = boardArr[1][1];
    if (centerValue !== null) {
      if (
        (centerValue === boardArr[0][0] && centerValue === boardArr[2][2]) ||
        (centerValue === boardArr[2][0] && centerValue === boardArr[0][2])
      ) {
        return centerValue;
      }
    }
    return false;
  };

  const checkForWinner = () => {
    return checkRows() || checkDiagonals();
  };

  const placeX = (position) => place("X", position);

  const place0 = (position) => place("0", position);

  const gameboard = { placeX, place0, clearBoard };
  Object.freeze(gameboard);
  return gameboard;
})();

for (let i = 0; i < 9; i++) {
  const value = i % 2 ? "0" : "X";
  const [x, y] = prompt(`Enter position of ${value} (example: "0 1"):`)
    .split(" ")
    .map((coord) => parseInt(coord));
  const winner =
    i % 2 ? gameboard.place0({ x, y }) : gameboard.placeX({ x, y });
  if (winner) {
    console.log(`${winner} won!`);
    break;
  }
  if (i === 8) console.log(`It's a tie!`);
}
