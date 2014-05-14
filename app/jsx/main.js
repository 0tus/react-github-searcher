/** @jsx React.DOM */
var MainPage = React.createClass({

  // --- React component methods ---

  getDefaultProps: function() {
    var routes = {
      search: SearchPage,
      user: UserPage
    };

    return {
      routes: routes
    };
  },

  getInitialState: function() {
    return {
      query: "",
      userLogin: "",
      resultsPerPage: 30,
      route: "search"
    };
  },

  // --- Main handlers ---

  handleUserSelection: function(data) {
    data.route = "user";
    this.setState(data);
  },

  handleNavToSearchPage: function() {
    this.setState({
      route: "search"
    });
  },

  mainHandlers: function() {
    return {
      handleUserSelection: this.handleUserSelection,
      handleNavToSearchPage: this.handleNavToSearchPage
    };
  },

  // --- React render method ---

  render: function() {
    return this.props.routes[this.state.route]({
      mainState: this.state,
      mainHandlers: this.mainHandlers()
    });
  }
});

// Start app
React.renderComponent(<MainPage />, document.getElementById("main"));
