import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// class for each square in a row
class Square extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			input: this.props.input,
		};
	}
	
	render()
	{
		const { input } = this.props;
		
		var colours = ['#6f42c1', '#d63384', '#dc3545', '#fd7e14', '#ffc107', '#198754', '#20c997', '#0dcaf0', '#0d6efd', '#6610f2'];
		var textColours = ['white', 'white', 'white', 'black', 'black', 'white', 'black', 'black', 'white', 'white'];
		var style = {
			backgroundColor: colours[input],
			color: textColours[input],
		};
		var inlineStyle = {
			display: "inline",
		};
		
		return (
			<div style={inlineStyle}>{input === "" ? (
				<div className="square border border-3 border-secondary" style={style}>
					<p>{input}</p>
				</div>
			) : (
				<div className="square border border-3 border-dark" style={style}>
					<p>{input}</p>
				</div>
			)}</div>
		);
	}
}

// class for each row of guesses
class Row extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			input: this.props.input,
			guess: this.props.guess,
			guessNum: this.props.guessNum,
		};
	}
	
	render()
	{
		var guess = this.state.guess;
		return (
			<div className="inline">
				<Square input={guess[0]}/>
				<Square input={guess[1]}/>
				<Square input={guess[2]}/>
				<Square input={guess[3]}/>
			</div>
		);
	}
}

// class for game
class Game extends React.Component
{
	constructor(props)
	{
		super(props);
		
		// generate secret code
		var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
		for(let i = 0; i < 4; i++)
		{
			var rand = Math.floor(Math.random() * (10-i) + i);
			var temp = nums[i];
			nums[i] = nums[rand];
			nums[rand] = temp;
		}
		
		// state includes digits in current guess, number of submitted
		// guesses, and digits in secret code
		this.state = {
			guesses: [{guessnum: 0, guess: ["", "", "", ""]}],
			numGuesses: 0,
			code: [nums[0], nums[1], nums[2], nums[3]],
		};
	}
	
	// when number button is clicked, we put this number in the first
	// available square of the current guess (row of squares)
	numClick(num)
	{
		for(let i = 0; i < 4; i++) // 4 is the length of each guess
		{
			// if the square at index i is empty
			if(this.state.guesses[this.state.numGuesses].guess[i] === "")
			{
				let guesses = [...this.state.guesses];
				guesses[this.state.numGuesses].guess[i] = num;
				this.setState({guesses});
				break;
			}
		}
	}
	
	// when submit button is clicked, we evaluate the guess and compare
	// it to the secret code
	submitClick()
	{
		// we only process the guess if all squares in the row contain a value
		if(this.state.guesses[this.state.numGuesses].guess.includes("") === false)
		{
			let guess = this.state.guesses[this.state.numGuesses].guess;
			let code = this.state.code;
			let red = 0; // number of values present in code and in correct place
			let white = 0; // number of values present in code but in wrong place
			
			// compare guess to code
			// the value displayed in red is the number of digits in the
			// code and in the correct position, while the value in
			// white/grey is the number of digits in the code but in the
			// incorrect position
			for(let i = 0; i < 4; i++)
			{
				if(guess[i] === code[i])
				{
					red += 1;
				}
				else if(code.includes(guess[i]))
				{
					white += 1;
				}
			}
			
			// update submitted guess score
			let guesses = [...this.state.guesses];
			guesses[this.state.numGuesses].red = red;
			guesses[this.state.numGuesses].white = white;
			
			// add another row for the next guess if guess is incorrect
			if(red !== 4)
			{
				guesses.push({guessnum: this.state.numGuesses+1, guess: ["", "", "", ""]});
				this.setState({guesses, numGuesses: this.state.numGuesses+1});
			}
			else
			{
				this.setState({guesses});
			}
		}
	}
	
	// clear all squares in current guess
	clearClick()
	{
		var guesses = [...this.state.guesses];
		for(let i = 0; i < 4; i++)
		{
			guesses[this.state.numGuesses].guess[i] = "";
		}
		this.setState({guesses});
	}
	
	render()
	{
		return (
			<div className="wrapper container-fluid">
				<header>
					<br/><br/>
					<h1 className="title">Mastermind</h1>
					<br/><br/>
					<button className="btn btn-outline-info" type="button" data-bs-toggle="collapse" data-bs-target="#howToPlay" aria-expanded="false" aria-controls="howToPlay"><p>How to Play</p></button>
					<div className="collapse howToPlay" id="howToPlay">
						<br/>
						<p>The computer has generated a secret random 4-digit code. Click the numbered buttons at the bottom to enter a guess, and press the Submit button to see how close it is to the computer's code. Each number can appear at most once in the code.</p>
						<br/>
						<p>Once you submit your guess, you will see two numbers. The number in red indicates the number of digits in your guess that appear in the secret code in the <b>SAME</b> position. The number in grey represents the number of digits in your guess that appear in the secret code but in a <b>DIFFERENT</b> position.</p>
						<br/>
						<p>The goal is to guess the secret code in the fewest number of guesses!</p>
					</div>
				</header>
				<br/>
				{this.state.guesses.map(guess => (
					<div key={guess.guessnum} className=" row container-fluid guess-row">
						<div className="col">
							<Row
								guess={guess.guess}
								guessNum={guess.guessnum}
							/>
							{this.state.numGuesses === guess.guessnum && guess.red !== 4 ? (
								<div className="inline">
									<button
										className="btn btn-secondary submit-button"
										onClick={() => this.submitClick()}
									>
										<p>Submit</p>
									</button>
									<button
										className="btn btn-danger clear-button"
										onClick={() => this.clearClick()}
									>
										<p>Clear</p>
									</button>
								</div>
							) : (this.state.numGuesses === guess.guessnum && guess.red === 4 ? (
								<div className="inline">
									<div className="redwhite border border-3 border-dark">
										<p className="red">{guess.red}</p>
									</div>
									<div className="redwhite border border-3 border-dark">
										<p className="white">{guess.white}</p>
									</div>
								</div>
							) : (
								<div className="inline">
									<div className="redwhite border border-3 border-dark">
										<p className="red">{guess.red}</p>
									</div>
									<div className="redwhite border border-3 border-dark">
										<p className="white">{guess.white}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
				{this.state.guesses[this.state.numGuesses].red === 4 && this.state.numGuesses > 0 ? (
					<div className="solvemsg border border-3 border-dark">
						<p>You cracked the code in {this.state.numGuesses+1} guesses!</p>
					</div>
				):(this.state.guesses[this.state.numGuesses].red === 4 ? (
					<div className="solvemsg border border-3 border-dark">
						<p>Wow, you cracked the code on your first try!</p>
					</div>
				):null)}
				<hr/>
				<div>
					<button
						className="btn num-button button-1"
						onClick={() => this.numClick(1)}
					>
						<p>1</p>
					</button>
					<button
						className="btn num-button button-2"
						onClick={() => this.numClick(2)}
					>
						<p>2</p>
					</button>
					<button
						className="btn num-button button-3"
						onClick={() => this.numClick(3)}
					>
						<p>3</p>
					</button>
					<button
						className="btn num-button button-4"
						onClick={() => this.numClick(4)}
					>
						<p>4</p>
					</button>
					<button
						className="btn num-button button-5"
						onClick={() => this.numClick(5)}
					>
						<p>5</p>
					</button>
				</div>
				<div>
					<button
						className="btn num-button button-6"
						onClick={() => this.numClick(6)}
					>
						<p>6</p>
					</button>
					<button
						className="btn num-button button-7"
						onClick={() => this.numClick(7)}
					>
						<p>7</p>
					</button>
					<button
						className="btn num-button button-8"
						onClick={() => this.numClick(8)}
					>
						<p>8</p>
					</button>
					<button
						className="btn num-button button-9"
						onClick={() => this.numClick(9)}
					>
						<p>9</p>
					</button>
					<button
						className="btn num-button button-0"
						onClick={() => this.numClick(0)}
					>
						<p>0</p>
					</button>
				</div>
				<br/><br/><br/>
			</div>
		);
	}
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);