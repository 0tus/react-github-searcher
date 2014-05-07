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
            <div>
              <form className="navbar-form navbar-right" role="form">
                <div className="form-group">
                  <input placeholder="User or organization" className="form-control" type="text" />
                </div>
                <button type="submit" className="btn btn-success">Search</button>
              </form>
            </div>
          </div>
        </div>
      );
    }
  });

  var Body = React.createClass({
    entries: function() {
      function getLogin(item) {
        return <li>{item.login}</li>;
      }

      return this.props.items.map(getLogin);
    },

    render: function() {
      return (
        <div className="container" role="main">
          <h1>{this.props.nResults} results found</h1>
          <ul>
            {this.entries()}
          </ul>
        </div>
      );
    }
  });

  var SearchPage = React.createClass({
    bodyData: function() {
      var results = this.props.results;

      return {
        nResults: results && results.total_count || 0,
        items: results && results.items || []
      };
    },

    render: function() {
      return (
        <div>
          <Header />
          {Body(this.bodyData())}
        </div>
      );
    }
  });

  global.SearchPage = SearchPage;
})(this);

