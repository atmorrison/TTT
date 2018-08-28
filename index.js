import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    render() {
        return (
            <button 
            className="square" 
            onClick={() =>  this.props.onClick()}
            >
            {this.props.value}
            </button>
        );
    }
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
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class MoveNav extends React.Component {
    renderNav(step) {
        return (
            <button
                className="move-nav"
                onClick={() => this.props.onClick(step)}
            >
            {step}
            </button>
        )
    }

    render() {
        return (
            <div>
                {this.renderNav('Back')}
                {this.renderNav('Forward')}
            </div>
        )
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleNavClick(step) {
        let stepIndex = step === 'Back' ? -1 : 1;
        if ((this.state.stepNumber + 1 === this.state.history.length && stepIndex === 1) || (this.state.stepNumber === 0 && stepIndex === -1)) {
            return;
        }
        this.setState({
            stepNumber: this.state.stepNumber + stepIndex,
            xIsNext: !this.state.xIsNext,
        });
    }

    handleSquareClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = (this.state.xIsNext ? 'X' : 'O');
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    // fff

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (this.state.stepNumber === 9) {
            status = 'Draw!';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
              <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleSquareClick(i)}
                />
              </div>
              <div className="game-info">
                <div>{status}</div>
                <MoveNav
                    onClick={(step) => this.handleNavClick(step)}
                />
              </div>
            </div>
        );
    }
}
  
// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

// ========================================

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
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}