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
    iconTypes: {
      "User": "glyphicon-user",
      "Organization": "glyphicon-home"
    },

    icon: function() {
      return "glyphicon " + this.iconTypes[this.props.data.type];
    },

    render: function() {
      var data = this.props.data;

      return (
        <a href={data.html_url} className="list-group-item entry-result">
          <img src={data.avatar_url} className="pull-right" />
          <span className={this.icon()}></span>
          &nbsp;
          <span className="entry-login">{data.login}</span>
        </a>
      );
    }
  });

  var CurrentResult = React.createClass({
    results: function() {
      if (this.props.nResults === 0) {
        return "No nResults"
      }

      return this.props.nResults + "results";
    },
    render: function() {
      return (
        <ul className="list-group">
          <li className="list-group-item list-group-item-info">
            <span className="badge">{this.results()}</span>
            {this.props.search}
          </li>
        </ul>
      );
    }
  });

  var Body = React.createClass({
    entries: function() {
      function addEntry(entry) {
        return <Entry key={entry.login} data={entry} />;
      }

      return this.props.data.items.map(addEntry);
    },

    render: function() {
      var data = this.props.data;

      return (
        <div className="container" role="main">
          <CurrentResult search={data.search}  nResults={data.nResults} />
          <div className="list-group">
            {this.entries()}
          </div>
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
