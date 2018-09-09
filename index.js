import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// update

class Square extends React.Component {
    render() {
        return (
            <button 
            className={"square" + (this.props.winner ? " win" : "")}
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
            winner={this.props.winners[i]} 
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
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                winners: Array(9).fill(false),
            }],
            stepNumber: 0,
            xIsNext: true,
        };

        fetch('http://13.237.202.210/budgie')
        .then(res => res.json())
        .then(res => this.setState(JSON.parse(res)))    
        .catch(error => console.error('Error:', error));
    }

    handleNavBack() {
        if (this.state.stepNumber === 0) {
            return;
        }
        this.setState({
            stepNumber: this.state.stepNumber - 1,
            xIsNext: !this.state.xIsNext,
        });
    }

    handleNavForward() {
        if (this.state.stepNumber - this.state.history.length === 1) {
            return;
        }
        this.setState({
            stepNumber: this.state.stepNumber + 1,
            xIsNext: !this.state.xIsNext,
        });
    }

    handleSquareClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winners = current.winners.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = (this.state.xIsNext ? 'X' : 'O');

        const winner = calculateWinner(squares);
        if (winner) {    
            for (let item of winner.line) {
                winners[item] = true;
            }
        }

        const currentState = {
            history: history.concat([{
                squares: squares,
                winners: winners,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        };

        fetch('http://13.237.202.210/budgie', {
            method: 'POST', 
            body: JSON.stringify(currentState), 
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(res => this.setState(res))
        .catch(error => console.error('Error:', error));

        
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status;
        if (winner) {
            status = 'Winner: ' + winner.player;
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
                    winners={current.winners}
                    onClick={(i) => this.handleSquareClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <div>
                    <button
                        className="move-nav"
                        onClick={() => this.handleNavBack()}
                        disabled = {this.state.stepNumber === 0}
                    >
                    Back
                    </button>
                    <button
                        className="move-nav"
                        onClick={() => this.handleNavForward()}
                        disabled = {this.state.history.length - this.state.stepNumber === 1}
                    >
                    Forward
                    </button>
                </div>
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
            return {
                player: squares[a],
                line: lines[i],
            };
        }
    }
    return null;
}
