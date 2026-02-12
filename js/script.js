const game = () => {
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
            (value === boardArr[y].at(x - 1) &&
              value === boardArr[y].at(x - 2)) ||
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

    // Prevents unexpected values in the boardArr
    const placeX = (position) => place("X", position);

    const place0 = (position) => place("0", position);

    const gameboard = { placeX, place0, clearBoard };
    Object.freeze(gameboard);
    return gameboard;
  })();

  const createPlayer = (placedValue) => {
    const place = () =>
      placedValue === "X"
        ? gameboard.placeX(position)
        : gameboard.place0(position);
    let name = placedValue;
    const player = { name, place };
    Object.freeze(player);
    return player;
  };

  const players = [];
  players.push(createPlayer("X"));
  players.push(createPlayer("0"));
  Object.freeze(players);
};
