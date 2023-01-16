import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let squares = [];
    let rows = [];

    for (let index = 0; index < 9; index++) {
      squares.push(this.renderSquare(index));
      if (index === 2 || index === 5 || index === 8) {
        let row = (
          <div className="board-row">{squares.slice(index - 2, index + 1)}</div>
        );
        rows.push(row);
      }
    }

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
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
    };
  }

  handleClick(i) {
    let currentRow = 0;
    let currentCol = 0;

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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
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
            }}
          >
            {desc}
          </button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = "Winner " + winner;
    } else {
      status = "Next player " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
