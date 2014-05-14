/** @jsx React.DOM */

(function(global, lib, $) {

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
                  <input
                    placeholder="User or organization"
                    className="form-control"
                    type="text"
                    ref="search"
                    onChange={this.handleSearchChange}
                    defaultValue={this.props.pageState.search}
                  />
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

    handleUserSelection: function() {
      this.props.onUserSelection({
        userLogin: this.props.data.login,
        query: this.props.pageState.search
      });
      return false;
    },

    render: function() {
      var data = this.props.data;

      return (
        <a
          href="#"
          className="list-group-item entry-result"
          onClick={this.handleUserSelection}
        >
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
      var results = this.props.pageState.results,
          nResults = results && results.total_count || 0;

      if (nResults === 0) {
        return "No Results";
      }

      return nResults + " results";
    },
    query: function() {
      if (this.props.pageState.search.trim().length === 0) {
        return "No search";
      }

      return "Query: " + this.props.pageState.search;
    },
    render: function() {
      return (
        <ul className="list-group">
          <li className="list-group-item list-group-item-info">
            <span className="badge">{this.results()}</span>
            {this.query()}
          </li>
        </ul>
      );
    }
  });

  var Body = React.createClass({

    entries: function() {
      var self = this,
          results = this.props.pageState.results,
          items = results && results.items || [];

      function addEntry(entry) {
        return (
          <Entry
            key={entry.login}
            data={entry}
            pageState={self.props.pageState}
            onUserSelection={self.props.mainHandlers.handleUserSelection}
          />
        );
      }

      return items.map(addEntry);
    },

    render: function() {
      var pageState = this.props.pageState;

      return (
        <div className="container" role="main">
          <CurrentResult pageState={this.props.pageState} />
          <div className="list-group">
            {this.entries()}
          </div>
        </div>
      );
    }
  });

  // --- Page ---

  var SearchPage = React.createClass({
    debounceTime: 1000,

    getInitialState: function() {
      return {
        search: this.props.mainState.query || "",
        results: {},
        queryPending: false
      };
    },

    componentDidMount: function() {
      this.sendGithubQuery();
    },

    conponentWillUnmount: function() {
      this.cancelAndCleanSearch();
    },

    cancelAndCleanSearch: function() {
      var self = this;

      function cancelAndClean(property) {
        if (self[property]) {
          self[property].abort();
          self[property] = null;
        }
      }

      ["debounce", "jqXHR"].forEach(cancelAndClean);
    },

    sendGithubQuery: function() {
      var self = this;

      function onSuccess(data) {
        self.setState({
          results: data,
          queryPending: false
        });
      }

      function onError(req, txtStatus, err) {
        console.error(err);
        self.setState({
          queryPending: false
        });
      }

      function cleanJqXHR() {
        self.jqXHR = null;
      }

      this.debounce = null;

      if (this.state.search.trim().length === 0) { return; }

      this.jqXHR = $
        .ajax({
          url: "https://api.github.com/search/users?q=" + this.state.search,
          dataType: "json"
        })
        .done(onSuccess)
        .fail(onError)
        .always(cleanJqXHR);
    },

    debounceXHR: function() {
      if (this.debounce) {
        this.debounce();
        return;
      }

      this.debounce = lib.debounce(this.sendGithubQuery, this.debounceTime, this);
      this.debounce();
    },

    handleSearchChange: function(data) {
      var self = this;

      data.queryPending = true;
      if (data.search.trim().length === 0) { data.results = {}; }
      this.setState(data);

      this.debounceXHR();
    },

    render: function() {
      return (
        <div>
          <Header
            onSearchChange={this.handleSearchChange}
            mainState={this.props.mainState}
            pageState={this.state}
          />
          <Body
            mainState={this.props.mainState}
            pageState={this.state}
            mainHandlers={this.props.mainHandlers}
          />
        </div>
      );
    }
  });

  global.SearchPage = SearchPage;
})(this, this, jQuery);
