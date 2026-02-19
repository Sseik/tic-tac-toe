const game = (() => {
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
      return null;
    };

    const clearBoard = () => boardArr.forEach((row) => row.fill(null, 0, 3));

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

  const createPlayer = (placedValue, name) => {
    name = name ? name : placedValue;
    const place = (position) =>
      placedValue === "X"
        ? gameboard.placeX(position)
        : gameboard.place0(position);
    const player = { name, place };
    Object.freeze(player);
    return player;
  };

  const players = {};
  let currentMark = "X";

  const makeMove = (position) => {
    const outcome = players[currentMark].place(position);
    currentMark = currentMark === "X" ? "0" : "X";
    return players[outcome]?.name;
  };

  const start = (nameX, name0) => {
    players["X"] = createPlayer("X", nameX);
    players["0"] = createPlayer("0", name0);
    gameboard.clearBoard();
    currentMark = "X";
  };

  const game = { start, makeMove };
  Object.freeze(game);
  return game;
})();

const displayController = (() => {
  const gameboardDiv = document.querySelector(".gameboard");
  const cells = [...gameboardDiv.children];
  let turn = 0;
  const nameXDiv = document.querySelector("#player1-name");
  const name0Div = document.querySelector("#player2-name");

  const getPosition = (cell) => {
    const number = cells.indexOf(cell);
    const y = Math.floor(number / 3);
    const x = number - 3 * y;
    return { x, y };
  };

  const handleClick = (e) => {
    const cell = e.target;
    if (cell.className !== "cell") return;
    if (cell.textContent !== "") return;

    cell.textContent = turn % 2 ? "0" : "X";
    const position = getPosition(cell);
    const outcome = game.makeMove(position);
    turn++;
    if (outcome !== undefined && outcome !== null) {
      alert(`${outcome} won!`);
      stop();
      return;
    }
    if (turn === 9) {
      alert("It's a tie!");
      stop();
      return;
    }
  };

  const clearBoard = () => {
    cells.forEach((cell) => (cell.textContent = ""));
  };

  const start = () => {
    clearBoard();
    turn = 0;
    game.start(nameXDiv.value, name0Div.value);
    gameboardDiv.addEventListener("click", handleClick);
  };
  const stop = () => {
    gameboardDiv.removeEventListener("click", handleClick);
  };

  document.querySelector(".switch-places").addEventListener("click", () => {
    [nameXDiv.value, name0Div.value] = [name0Div.value, nameXDiv.value];
  });

  const displayController = { start };
  Object.freeze(displayController);
  return displayController;
})();

document
  .querySelector(".controls button")
  .addEventListener("click", displayController.start);
