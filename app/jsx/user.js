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
        <div>{this.props.data.length}</div>
      );
    }
  });

  // --- page ---

  var UserPage = React.createClass({
    getDefaultProps: function() {
      return {
        login: "AF83"
      };
    },

    getInitialState: function() {
      return {
        data: []
      };
    },

    sendGithubQuery: function() {
      var self = this;

      function onSuccess(data) {
        console.log(data);
        self.setState({
          data: data
        });
      }

      function onError(req, txtStatus, err) {
        console.error(err);
      }

      jQuery
        .ajax({
          url: "https://api.github.com/users/" + this.props.login + "/repos",
          dataType: "json"
        })
        .done(onSuccess)
        .fail(onError);
    },

    componentDidMount: function() {
      this.sendGithubQuery();
    },

    render: function() {
      return (
        <div>
          <Header />
          <Body data={this.state.data}/>
        </div>
      );
    }
  });

  global.UserPage = UserPage;

})(this);
