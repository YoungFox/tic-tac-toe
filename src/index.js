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
			<button className="square" onClick={this.props.onClick} style={{background: this.props.background}}>
				{this.props.value}
			</button>
		)
	}
}

class Board extends React.Component{
	
	renderSquare(i){
		return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}
			background={(this.props.line.indexOf(i) === -1) ? '#fff' : 'red'}/>;
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

function ToogleBtn(props){
	return (
		<button onClick={props.onClick}>{props.value}</button>
	);
}

class Game extends React.Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	history: [{
	  		squares: Array(9).fill(null),
	  		location: '(0,0)',
	  		line:null
	  	}],
	  	xIsNext: true,
	  	stepNumber: 0,
	  	order: true
	  };

	  this.handleClick = this.handleClick.bind(this);
	  this.toogleOrder = this.toogleOrder.bind(this);
	}


	handleClick(i){
		const stepNumber = this.state.stepNumber;
		const history = this.state.history.slice(0,stepNumber+1);
		const current = history[stepNumber];
		const squares = current.squares.slice();
		let location = '(' + (Math.floor(i/3)+1) + ',' + (i%3+1) + ')';
		const winnerInfo = checkWinner(squares);

		if(squares[i] || winnerInfo.winner){
			return;
		}
		
		const xIsNext = this.state.xIsNext;
		if(xIsNext){
			squares[i] = 'X';
		}else{
			squares[i] = 'O';
		}

		const winnerInfo1 = checkWinner(squares);
			// const winnerInfo = checkWinner(squares);
		// console.log(winnerInfo);
		// if(winnerInfo.winner){
		// 	debugger;
		// 	this.setState({line:winnerInfo.line});
		// }

		this.setState({history: history.concat([{squares: squares,location:location,
			line:(winnerInfo1.winner ? winnerInfo1.line : [])}]),
			xIsNext: !xIsNext,stepNumber : stepNumber +1});
	}

	jumpTo(step){
		this.setState({
			stepNumber: step,
			xIsNext: (step%2) ? false : true
		});
	}
	toogleOrder(){
		let order = this.state.order;
		this.setState({
			order: !order
		});
	}

	render(){
		const stepNumber = this.state.stepNumber;
		const history = this.state.history;
		const current = history[stepNumber];
		const squares = current.squares.slice();

		let status = '';
		let winner = checkWinner(squares).winner;

		if(winner){
			status = 'Winner is ' + winner;
		}else{
			status = 'Nex player: ' + (this.state.xIsNext ? 'X' : 'O');
		}
		


		const moves = history.map((step, move) => {
			const desc = move ? ('Move #' + move + step.location): 'Game start';
			return(
				<li key={move}>
					<a href="#" onClick={() => this.jumpTo(move)}
					style={{color:(move === stepNumber ? 'red' : '#000')}} >{desc}</a>
				</li>
			);
		});

		if(!this.state.order){
			moves.reverse();
		}

		return(
			<div className="game">
				<div className="game-board">
					<Board status={status} squares={squares} line={current.line?current.line:[]} onClick={this.handleClick}/>
				</div>
				<div className="game-info">
					<div>{/* status */}</div>
					<ol>{moves}</ol>
				</div>
				<div>
					<ToogleBtn value={this.state.order?"正序":"逆序"} onClick={this.toogleOrder}/>
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

	let winnerInfo =  {winner: null,line: null};

	for(let i = 0;i < lines.length ;i ++){
		const [a,b,c] = lines[i];
		if(arr[a] === arr[b] && arr[a] === arr[c]){

			winnerInfo ={
				winner: arr[a],
				line: lines[i]
			}
			break;
		}
	}
	return winnerInfo;
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
