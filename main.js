import './style.css'

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
  const gameData = {
    isOver: false,
    winner: null,
    winningCombination: null
  };
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

  const getActivePlayer = () => activePlayer
  const changeActivePlayer = () => activePlayer = activePlayer === players[0] ? players[1] : players[0]
  const playRound = (row, column) => {
    const roundValid = markCell(row, column, activePlayer)

    if(!roundValid) {
      return
    }

    changeActivePlayer()
    printBoard()

    return true
  }

  const checkWinner = () => {
    let isOver = false
    const flatValues = getBoard().flat().map(cell => cell.getValue())
    winningCombinations.forEach(combo => {
      const check = combo.map(num => flatValues[num])
      if(check[0] !== null && check.every(num => num === check[0])) {
        isOver = true
      }
    })
    return isOver
  }

  const getGameData = () => ({...gameData})

  return {
    playRound,
    getGameData,
    getActivePlayer,
    checkWinner
  }
}

function DisplayController() {

  const controller = GameController(
    Player('Player One', 'X'),
    Player('Player Two', 'O')
  );

  const board = document.querySelector('.board');
  board.addEventListener('click', e => {

    if(e.target === board) {
      return
    }
    const cellDom = e.target
    const [row, column] = [cellDom.dataset.row, cellDom.dataset.column]
    const currentPlayer = controller.getActivePlayer()
    const mark = currentPlayer.getMark()
    const isValid = controller.playRound(row, column)
    if(!isValid) {
      return
    } 
    const gameOver = controller.checkWinner()
    if(gameOver) {
      alert(`game over, ${currentPlayer.getName()} won`)
    }
    e.target.classList.add('marked')
    e.target.innerText = mark
    setHover()

  })
  
  const setHover = () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.setAttribute('turn', controller.getActivePlayer().getMark()))
  }

  setHover()
}

DisplayController()





