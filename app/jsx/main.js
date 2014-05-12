/** @jsx React.DOM */

var MainPage = React.createClass({
  KEYS_TO_PASS: ["query", "results"],

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
      results: {},
      route: "search"
    };
  },

  render: function() {
    var self = this;

    function addStateEntry(hash, key) {
      hash[key] = self.state[key];
      return hash;
    }

    return this.props.routes[this.state.route](
      this.KEYS_TO_PASS.reduce(addStateEntry, {})
    );
  }
});

// Start app
React.renderComponent(<MainPage />, document.getElementById("main"));
