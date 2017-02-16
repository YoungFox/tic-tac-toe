import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

class Square extends React.Component{
	constructor(props) {
	  super(props);
	
	  this.state = {value: null};
	}



	render(){
		return (
			<button className="square" onClick={this.props.onClick} >
				{this.props.value}
			</button>
		)
	}
}

class Board extends React.Component{
	
	renderSquare(i){
		return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
	}

	render(){
		// let list = <div />;
		// let arr = [0,1,2];
		// let list = arr.map((number)=>{
		// 	return(<div className="board-row"> 
		// 		{arr.map((n)=>{
		// 			return this.renderSquare(number*3 + n)			
		// 		})}
		// 	</div>)
		// });
	
		let list = [];
		for(let i = 0;i < 3;i++){
			let sublist = [];
			for(let j = 0;j < 3;j++){
				sublist.push(this.renderSquare(i*3 + j));
			}
			list.push(<div className="board-row">{sublist}</div>);
		}

		return(
			<div>
				<div className="status">{this.props.status}</div>
				{list}
			</div>
		);
	}
}

class Game extends React.Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	history: [{
	  		squares: Array(9).fill(null),
	  		location: '(0,0)'
	  	}],
	  	xIsNext: true,
	  	stepNumber: 0
	  };

	  this.handleClick = this.handleClick.bind(this);
	}


	handleClick(i){
		const stepNumber = this.state.stepNumber;
		const history = this.state.history.slice(0,stepNumber+1);
		const current = history[stepNumber];
		const squares = current.squares.slice();
		let location = '(' + (Math.floor(i/3)+1) + ',' + (i%3+1) + ')';

		if(squares[i] || checkWinner(squares)){
			return;
		}
		
		const xIsNext = this.state.xIsNext;
		if(xIsNext){
			squares[i] = 'X';
		}else{
			squares[i] = 'O';
		}
		this.setState({history: history.concat([{squares: squares,location:location}]),
			xIsNext: !xIsNext,stepNumber : stepNumber +1});
	}

	jumpTo(step){
		this.setState({
			stepNumber: step,
			xIsNext: (step%2) ? false : true
		});
	}

	render(){
		const stepNumber = this.state.stepNumber;
		const history = this.state.history;
		const current = history[stepNumber];
		const squares = current.squares.slice();

		let status = '';
		let winner = checkWinner(squares);
		if(winner){
			status = 'Winner is ' + winner;
		}else{
			status = 'Nex player: ' + (this.state.xIsNext ? 'X' : 'O');
		}
		
		const moves = history.map((step, move) => {
			console.log(stepNumber === move);
			const desc = move ? ('Move #' + move + step.location): 'Game start';
			return(
				<li key={move}>
					<a href="#" onClick={() => this.jumpTo(move)}
					style={{color:(move === stepNumber ? 'red' : '#000')}} >{desc}</a>
				</li>
			);
		});

		return(
			<div className="game">
				<div className="game-board">
					<Board status={status} squares={squares} onClick={this.handleClick}/>
				</div>
				<div className="game-info">
					<div>{/* status */}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

function checkWinner(arr){
	const lines = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6]
	];

	let winner =  null;

	for(let i = 0;i < lines.length ;i ++){
		const [a,b,c] = lines[i];
		// console.log(arr[a] === arr[b] && arr[a] === arr[c]);
		if(arr[a] === arr[b] && arr[a] === arr[c]){
			winner = arr[a];
			break;
		}
	}
	return winner;
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
