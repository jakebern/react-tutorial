var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api');
var Loading = require('./Loading');

function SelectLanguage(props){
	var languages = ['All', 'Javascript', 'Ruby', 'Java', 'CSS', 'Python'];
	return (
		<ul className = 'languages'>
			{languages.map((lang) => {
				return(
					<li key = {lang}
					onClick = {props.onSelect.bind(null, lang)}
					style={lang === props.selectedLanguage ? {color: '#d0021b'} : null}>
						{lang} 
					</li>
					)
			})}
		</ul>
	)
}

function RepoGrid(props){
	return (
		<ul className='popular-list'>
			{props.repos.map(
				function(repo, index) {
					return (
						<li key = {repo.name} className='popular-item'>
							<div className='popular-rank'>#{index+1}</div>
							<ul className='space-list-items'>
								<li>
									<img
										className='avatar'
										src = {repo.owner.avatar_url}
										alt = {'Avatar for ' + repo.owner.login} />
								</li>
								<li> <a href= {repo.html_url}>{repo.name}</a></li>
								<li>@{repo.owner.login}</li>
								<li>{repo.stargazers_count} stars</li>
							</ul>
						</li>
					)
				}
			)}
		</ul>
	)
}

RepoGrid.propTypes = {
	repos: PropTypes.array.isRequired
}

SelectLanguage.propTypes = {
	selectedLanguage: PropTypes.string.isRequired,
	onSelect: PropTypes.func.isRequired,
}


class Popular extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedLanguage: 'All',
			repos: null
		};
		this.updateLanguage = this.updateLanguage.bind(this);
	}

	//All AJAX requests would be called in component did mount
	componentDidMount() {
		this.updateLanguage(this.state.selectedLanguage);
	}

	updateLanguage(lang){
		this.setState({
			selectedLanguage: lang,
			repos: null
		})


		//repos state will be temporarily null while wait for function to return
		api.fetchPopularRepos(lang).then(function(repos){
				//can use this.setState here because using bind on 
				//function that will hold keep this context (ie. returns)
				//new function with the proper context binded
				this.setState(function () {
					return {
						repos: repos
					}
				})
		}.bind(this)) 
	}

	render() {

		return (
			<div>
				<SelectLanguage
					selectedLanguage = {this.state.selectedLanguage}
					onSelect = {this.updateLanguage}
				/>
				{!this.state.repos ?
					<Loading /> :
					<RepoGrid repos = {this.state.repos} />
				}
			</div>
		)
	}
}

module.exports = Popular;