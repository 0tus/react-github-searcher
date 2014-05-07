/** @jsx React.DOM */

(function(global) {
  var Header = React.createClass({
    render: function() {
      return (
        <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand">Github Repos Navigator</a>
            </div>
          </div>
        </div>
      );
    }
  });

  var Body = React.createClass({
    render: function() {
      return (
        <div className="container" role="main">
          <h1>Test</h1>
        </div>
      );
    }
  });

  var SearchPage = React.createClass({
    render: function() {
      return (
        <div>
          <Header />
          <Body />
        </div>
      );
    }
  });

  global.SearchPage = SearchPage;
})(this);

