var React = require('react');
var Link = require('react-router-dom').Link;
var PropTypes = require('prop-types');

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

	render() {
		var playerOneName = this.state.playerOneName;
		var playerTwoName = this.state.playerTwoName;
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
					{!playerTwoName && 
						<PlayerInput
							id = "playerTwo"
							label = 'Player Two'
							onSubmit = {this.handleSubmit}
						/>
					}
				</div>
			</div>
		)
	}
}

module.exports = Battle;