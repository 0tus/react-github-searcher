/** @jsx React.DOM */

(function(global) {

  // --- header ---

  var Header = React.createClass({
    render: function() {
      return (
        <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand">Github Repos Navigator</a>
            </div>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="#">New Search</a>
              </li>
            </ul>
          </div>
        </div>
      );
    }
  });

  // --- body ---

  var Body = React.createClass({
    render: function() {
      return (
        <div></div>
      );
    }
  });

  // --- page ---

  var UserPage = React.createClass({
    render: function() {
      return (
        <div>
          <Header />
          <Body />
        </div>
      );
    }
  });

  global.UserPage = UserPage;

})(this);
