var React = require('react');
var Link = require('react-router-dom').Link;
var PropTypes = require('prop-types');
var PlayerPreview = require('./PlayerPreview');

//only create new file for new component if the component will
//be reused by components outside of this file
class PlayerInput extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			username: ''
		}
		//need to include here because reference 
		//'this' in the functions
		this.handleChange=this.handleChange.bind(this);
		this.handleSubmit=this.handleSubmit.bind(this);

	}
	handleChange(event){
		//value grabs text from inputfield
		var value = event.target.value;
		this.setState(function() {
			return {
				username: value
			}
		})
	}

	handleSubmit(event){
		//don't want form to submit to server
		event.preventDefault();

		//handleSubmit that we created in parent
		this.props.onSubmit(
			this.props.id,
			this.state.username
		)
	}

	render(){
		return (

			//because button type is submit, form will run whatever
			//function is defined as "onSubmit"
			<form className = 'column' onSubmit = {this.handleSubmit}>
				<label className = 'header' htmlFor='username'>
					{this.props.label}
				</label>
				<input
					id = 'username'
					placeholder = 'github username'
					type = 'text'
					autoComplete='off'
					value = {this.state.username}
					onChange = {this.handleChange}
				/>
				<button
					className = 'button'
					type = 'submit'
					disabled = {!this.state.username}>
					Submit
				</button>
			</form>
		)
	}
}

PlayerInput.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	onSubmit: PropTypes.func.isRequired
}

class Battle extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			playerOneName: '',
			playerTwoName: '',
			playerOneImage: null,
			playerTwoImage: null,
		}

		//this keyword inside handleSubmit will always
		//refer to this component
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleReset = this.handleReset.bind(this);
	}

	handleSubmit(id, username) {
		this.setState(function ()
		{
			var newState = {};
			newState[id + 'Name'] = username;
			newState[id + 'Image'] = 'https://github.com/' + username + '.png?size=200';
			return newState;
		})
	}

	handleReset(id){
		this.setState(function(){
			var newState = {};
			newState[id + 'Name'] = '';
			newState[id + 'Image'] = null;
			return newState;
		})
	}

	render() {
		var playerOneName = this.state.playerOneName;
		var playerTwoName = this.state.playerTwoName;
		var playerOneImage = this.state.playerOneImage;
		var playerTwoImage = this.state.playerTwoImage;

		//props from router
		var match = this.props.match;

		return (
			<div>
				<div className = 'row'>
					{!playerOneName && 
						<PlayerInput
							id = "playerOne"
							label = 'Player One'
							onSubmit = {this.handleSubmit}
						/>
					}
					{playerOneImage !==null && 
						<PlayerPreview
							avatar = {playerOneImage}
							username = {playerOneName}>
							<button 
									className = 'reset'
									//Using bind just so can pass a specific function to tell which
									//Player to reset
									onClick = {this.handleReset.bind(null, 'playerOne')}>
									Reset 
							</button>
						</PlayerPreview>
					}
					{!playerTwoName && 
						<PlayerInput
							id = "playerTwo"
							label = 'Player Two'
							onSubmit = {this.handleSubmit}
						/>
					}
					{playerTwoImage !==null && 
						<PlayerPreview
							avatar = {playerTwoImage}
							username = {playerTwoName}>
							<button 
									className = 'reset'
									//Using bind just so can pass a specific function to tell which
									//Player to reset
									onClick = {this.handleReset.bind(null, 'playerTwo')}>
									Reset 
							</button>
						</PlayerPreview>
					}
				</div>
				{playerOneImage && playerTwoImage &&
					<Link 
						className='button'
						to={{
							//match.url = current URL
							pathname: match.url + '/results',
							search: '?playerOneName=' + playerOneName +
								'&playerTwoName=' + playerTwoName
						}}>
						Battle
					</Link>
				}
			</div>
		)
	}
}

module.exports = Battle;