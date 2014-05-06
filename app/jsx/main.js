/** @jsx React.DOM */

var MainPage = React.createClass({
  getInitialState: function() {
    return {
      unixTime: Date.now()
    };
  },
  updateTimeState: function() {
    this.setState({
      unixTime: Date.now()
    });
  },
  componentDidMount: function() {
    this.interval = setInterval(this.updateTimeState, 10);
  },
  render: function() {
    return (
      <div id="app">
        <h2>{this.state.unixTime}</h2>
      </div>
    );
  }
});

React.renderComponent(<MainPage />, document.getElementById("main"));
