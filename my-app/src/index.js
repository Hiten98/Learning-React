import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => {
        this.props.onClick(i)
      }}
    />;
  }

  render() {
    let rowCount = 3;
    let colCount = 3;
    return (
      <div>
        {
          [...new Array(rowCount)].map((x, i) => {
            return (
              <div className='board-row' key={i}>
                {
                  [...new Array(colCount)].map((y, j) => {
                    return(
                      this.renderSquare(i*colCount+j)
                    )
                  })
                }
              </div>
            );
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      moves: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const moves = this.state.moves;
    const row = Math.floor(i/3) + 1;
    const col = i%3 + 1;
    if (!squares[i] && !calculateWinner(squares)) {
      squares[i] = (this.state.xIsNext ? 'X' : 'O');
      moves[history.length] =(this.state.xIsNext ? 'X' : 'O') + " moves to (" + row + ", " + col + ")" ;
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        moves: moves
      })
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2 ) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      // console.log(this.state.moves[move]);
      const desc = move ?
        'Go to move #' + move + ": " + this.state.moves[move]:
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (!checkTie(current.squares)){
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    } else {
      status = "Tie!"
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

function checkTie(squares) {
  for (var i = 0; i < squares.length; i++) {
    if(!squares[i])
    return null;
  }
  return "TIE"
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
