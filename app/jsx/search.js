/** @jsx React.DOM */

(function(global) {

  // --- Header ---

  var Header = React.createClass({
    handleSearchChange: function() {
      var search = this.refs.search.getDOMNode().value.trim();
      this.props.onSearchChange({ search: search });
    },

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
                  <input placeholder="User or organization" className="form-control" type="text" ref="search" onChange={this.handleSearchChange} />
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  });

  // --- Body ---

  var Entry = React.createClass({
    render: function() {
      return <li>{this.props.login}</li>
    }
  });

  var Body = React.createClass({
    entries: function() {
      function addEntry(entry) {
        return <Entry key={entry.login} login={entry.login} />;
      }

      return this.props.data.items.map(addEntry);
    },

    render: function() {
      return (
        <div className="container" role="main">
          <h1>{this.props.data.nResults} results found</h1>
          <h2>Search for: {this.props.data.search}</h2>
          <ul>
            {this.entries()}
          </ul>
        </div>
      );
    }
  });

  // --- Page ---

  var SearchPage = React.createClass({
    getInitialState: function() {
      return {
        search:  this.props.initialSearch  || "",
        results: this.props.initialResults || {}
      };
    },

    bodyData: function() {
      var results = this.props.results;

      return {
        nResults: results && results.total_count || 0,
        items: results && results.items || [],
        search: this.state.search || "No search"
      };
    },

    handleSearchChange: function(data) {
      this.setState(data);
    },

    render: function() {
      return (
        <div>
          <Header onSearchChange={this.handleSearchChange} />
          <Body data={this.bodyData()} />
        </div>
      );
    }
  });

  global.SearchPage = SearchPage;
})(this);
