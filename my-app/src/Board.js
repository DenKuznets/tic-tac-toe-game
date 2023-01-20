class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        winner={winnerSquares.includes(i)}
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let squares = [];
    let rows = [];
    let rowKey = 0;

    for (let index = 0; index < 9; index++) {
      // создаем квадратики
      squares.push(this.renderSquare(index));
      // при создании 3 квадратиков создаем ряд и помещаем туда 3 последних квадрата
      if (index === 2 || index === 5 || index === 8) {
        rowKey++;
        let row = (
          <div key={rowKey} className="board-row">
            {squares.slice(index - 2, index + 1)}
          </div>
        );
        rows.push(row);
      }
    }

    return <div>{rows}</div>;
  }
}
