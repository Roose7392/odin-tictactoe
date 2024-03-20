function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for(let i = 0; i < rows; i++) {
    board.push([]);
    for(let y = 0; y < columns; y++) {
      board[i].push(Cell())
    }
  }

  const markCell = (row, column, player) => {
    const cell = board[row][column];
    if(cell.getValue() !== null) {
      return false
    }
    cell.mark(player)
    return true
  }

  const getBoard = () => board;
  const printBoard = () => { 
    console.log('__________')
    board.forEach(row => {

    console.log(row.reduce((acc, curr) => {
      if(curr.getValue() === null) {
        return acc + ' . '
      }
      return acc + ` ${curr.getValue()} ` 
    }, ''))})
    console.log('__________')
}

  return { getBoard, printBoard, markCell};
};

function Cell() {
  let value = null;

  const mark = (player) => {
    value = player.getMark()
  };

  const getValue = () => value;

  return { mark, getValue };
};

function Player(name, mark) {
  const getName = () => name;
  const getMark = () => mark;

  return {
    getName,
    getMark
  }
}

function GameController(playerOne, playerTwo) {
  const players = [playerOne, playerTwo];
  let activePlayer = players[0]
  const {getBoard, printBoard, markCell} = GameBoard()
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
 
  const changeActivePlayer = () => activePlayer = activePlayer === players[0] ? players[1] : players[0]
  const playRound = (row, column) => {
    const roundValid = markCell(row, column, activePlayer)

    if(!roundValid) {
      return
    }

    changeActivePlayer()
    printBoard()
    checkWinner()
  }

  const checkWinner = () => {
    const flatValues = getBoard().flat().map(cell => cell.getValue())
    winningCombinations.forEach(combo => {
      const check = combo.map(num => flatValues[num])
      if(check[0] !== null && check.every(num => num === check[0])) {
        console.log('winner!', combo)
      }
    })
  }

  return {
    playRound,
    checkWinner
  }
}

const controller = GameController(
  Player('Player One', 'X'),
  Player('Player Two', 'O')
);
controller.playRound(1,1);
controller.playRound(0, 0)
controller.playRound(2,1);
controller.playRound(0, 1);
controller.playRound(1, 2);
controller.playRound(0, 2)


