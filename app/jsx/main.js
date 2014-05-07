/** @jsx React.DOM */

var MainPage = React.createClass({
  getDefaultProps: function() {
    var routes = {
      search: SearchPage,
      results: true
    };

    return {
      routes: routes
    };
  },

  getInitialState: function() {
    return {
      user: null,
      org:  null,
      excludeForks: false,
      route: "search"
    };
  },

  render: function() {
    return this.props.routes[this.state.route](null);
  }
});

// Start app
React.renderComponent(<MainPage />, document.getElementById("main"));
