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

  return { getBoard, markCell};
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
  const {getBoard, markCell} = GameBoard()
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
    return true
  }

  const checkStatus = () => {
    let isOver = 'ongoing'
    const flatValues = getBoard().flat().map(cell => cell.getValue())
    winningCombinations.forEach(combo => {
      const check = combo.map(num => flatValues[num])
      if(check[0] !== null && check.every(num => num === check[0])) {
        isOver = 'victory'
      } else if(flatValues.every(value => value!== null)) {
        isOver = isOver === 'victory' ? 'victory' : 'draw'
      }
    })
    return isOver
  }

  const getGameData = () => ({...gameData})

  return {
    playRound,
    getGameData,
    getActivePlayer,
    checkStatus
  }
}

function DisplayController(counter = 0,playerOneName, playerTwoName) {
  document.querySelector('#app').innerHTML = 
  `<p class="turn">Player one's turn</p>
  <div class="board">
    <div class="cell" data-row="0" data-column="0"></div>
    <div class="cell" data-row="0" data-column="1"></div>
    <div class="cell" data-row="0" data-column="2"></div>
    <div class="cell" data-row="1" data-column="0"></div>
    <div class="cell" data-row="1" data-column="1"></div>
    <div class="cell" data-row="1" data-column="2"></div>
    <div class="cell" data-row="2" data-column="0"></div>
    <div class="cell" data-row="2" data-column="1"></div>
    <div class="cell" data-row="2" data-column="2"></div>
</div>
<button class="restart-button hidden">Restart</button>`

  while(!playerOneName) {
    playerOneName = prompt('Enter Player One Name')
  }

  while(!playerTwoName) {
    playerTwoName = prompt('Enter Player Two Name')
  }
  const players = counter % 2 === 0 
  ? [Player(playerOneName, 'X'), Player(playerTwoName, 'O')]
  : [Player(playerTwoName, 'O'), Player(playerOneName, 'X')]
  const controller = GameController(
    ...players
  );

  const cells = document.querySelectorAll('.cell');
  const display = document.querySelector('.turn')
  const restartButton = document.querySelector('.restart-button')
  const board = document.querySelector('.board');
  const boardListener = e => {
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
    const gameStatus = controller.checkStatus()
    e.target.classList.add('marked')
    e.target.innerText = mark
    updateDisplay(controller.getActivePlayer())
    if(gameStatus === 'victory') {
      endGame()
      display.innerText = `${currentPlayer.getName()} won!`

    }
    if(gameStatus === 'draw') {
      endGame()
      display.innerText = 'Draw!'
    }

    function endGame() {
      board.removeEventListener('click', boardListener)
      cells.forEach(cell => cell.removeAttribute('turn'))
      toggleRestartButton();
  }

    
  }
  board.addEventListener('click', boardListener)
  

  const updateDisplay = (player) => {
    cells.forEach(cell => cell.setAttribute('turn', player.getMark()));
    display.innerText = `${player.getName()}'s turn`
  }

  updateDisplay(controller.getActivePlayer());

  function toggleRestartButton() {
    restartButton.classList.toggle('hidden')
  }

  restartButton.addEventListener('click', () => DisplayController(++counter, playerOneName, playerTwoName))
}

DisplayController()





