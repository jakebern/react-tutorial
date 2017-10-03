var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = require('prop-types');
require('./index.css');

// App becomes whatever is exported from this path
var App = require('./components/App'); 

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);