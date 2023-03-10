import React from "react";
import Board from './Board.js'

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          coords: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      reversed: false,
    };
  }

  handleClick(i) {
    let currentRow = 0;
    let currentCol = 0;

    // определить текущий ряд куда был вставлен крестик/нолик
    switch (true) {
      case i >= 0 && i <= 2:
        currentRow = 1;
        break;
      case i >= 3 && i <= 5:
        currentRow = 2;
        break;
      case i >= 6 && i <= 8:
        currentRow = 3;
        break;
      default:
        break;
    }

    // определить текущую колонку куда был вставлен крестик/нолик
    switch (true) {
      case i === 0 || i === 3 || i === 6:
        currentCol = 1;
        break;
      case i === 1 || i === 4 || i === 7:
        currentCol = 2;
        break;
      case i === 2 || i === 5 || i === 8:
        currentCol = 3;
        break;
      default:
        break;
    }

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          coords: `col ${currentCol} row ${currentRow}`,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  boldItem(item) {
    let ol = item.closest("ol");
    let items = ol.querySelectorAll("button");
    for (let i of items) {
      i.classList.remove("currentItem");
    }
    item.classList.add("currentItem");
  }

  handleReverseClick() {
    this.setState({
      reversed: !this.state.reversed,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const win = calculateWinner(current.squares);
    let winner;
    let winnerSquares = [];
    if (win !== null) {
      winner = win.winner;
      winnerSquares = win.winnerSquares;
    }

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + " " + step.coords
        : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={(event) => {
              if (!event.target.classList.contains("currentItem")) {
                this.boldItem(event.target);
              }
              this.jumpTo(move);
              winnerSquares = [];
            }}
          >
            {desc}
          </button>
        </li>
      );
    });
    let status;
    switch (true) {
      case winner != null:
        status = "Winner " + winner;
        break;
      // если победителя нет и нет пустых клеток (массив квадратов не содержит null)
      case !winner && !current.squares.includes(null):
        status = "Draw";
        break;
      default:
        status = "Next player " + (this.state.xIsNext ? "X" : "O");
        break;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerSquares={winnerSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            className="reverseButton"
            onClick={() => this.handleReverseClick()}
          >
            Reverse
          </button>
          {this.state.reversed ? (
            <ol reversed>{moves.reverse()}</ol>
          ) : (
            <ol>{moves}</ol>
          )}
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winnerSquares: lines[i],
      };
    }
  }
  return null;
}
