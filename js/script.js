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

  const createPlayer = (placedValue, name) => {
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
    return outcome;
  };

  const playRound = () => {
    for (let i = 0; i < 9; i++) {
      const [x, y] = prompt(
        `Enter position of ${currentMark} (example: "0 1"):`,
      )
        .split(" ")
        .map((item) => parseInt(item));
      const outcome = makeMove({ x, y });
      if (outcome) {
        console.log(`${players[outcome].name} won!`);
        return;
      }
    }
  };

  const start = () => {
    const nameX = "X"; /* prompt("1st Player's name: ") */
    const name0 = "0"; /* prompt("2nd Player's name:") */
    players["X"] = createPlayer("X", nameX);
    players["0"] = createPlayer("0", name0);
    /* playRound(); */
  };

  const restart = () => {
    gameboard.clearBoard();
    playRound();
  };

  const game = { start, makeMove, restart };
  Object.freeze(game);
  return game;
})();

const displayController = (() => {
  const gameboardDiv = document.querySelector(".gameboard");
  const cells = [...gameboardDiv.children];
  let turn = 0;

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
    if (outcome) {
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

  const start = () => {
    turn = 0;
    game.start();
    gameboardDiv.addEventListener("click", handleClick);
  };
  const stop = () => {
    gameboardDiv.removeEventListener("click", handleClick);
  };

  const displayController = { start };
  Object.freeze(displayController);
  return displayController;
})();

displayController.start();
