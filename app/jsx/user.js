/** @jsx React.DOM */

(function(global) {

  // --- header ---

  var Header = React.createClass({
    handleNavToSearchPage: function() {
      this.props.mainHandlers.handleNavToSearchPage();
      return false;
    },
    render: function() {
      return (
        <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand">Github Repos Navigator</a>
            </div>
            <div className="navbar-header navbar-right">
              <a className="navbar-brand">{this.props.mainState.userLogin}</a>
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="#" onClick={this.handleNavToSearchPage}>New Search</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }
  });

  // --- body ---

  var FilterResults = React.createClass({
    render: function() {
      return (
        <form className="form-inline" role="form">
          <div className="form-group">
            <input className="form-control" type="text" placeholder="Filter Repos" />
          </div>
        </form>
      );
    }
  });

  var Pagination = React.createClass({
    maxPages: function() {
      var n,
          pageState = this.props.pageState,
          mainState = this.props.mainState

      if (!pageState.user.public_repos) { return 1; }

      var n = Math.ceil(pageState.user.public_repos / mainState.resultsPerPage);
      // Display one page even if there are no repos
      return n > 0 ? n : 1;
    },
    isFirstPage: function() {
      return this.props.pageState.page === 1;
    },
    isLastPage: function() {
      return this.props.pageState.page === this.maxPages()
    },
    prevPageClass: function() {
      return this.isFirstPage() ? "disabled" : "";
    },
    nextPageClass: function() {
      return this.isLastPage() ? "disabled" : "";
    },
    pageButtons: function() {
      var i, len, buttonClass, buttons = [];

      for (i = 1, len = this.maxPages(); i <= len; i++) {
        buttonClass = (i === this.props.pageState.page ? "active" : "");
        buttons.push(<li key={i} className={buttonClass}><a href="#">{i}</a></li>);
      }

      return buttons;
    },
    render: function() {
      return (
        <div>
          <ul className="pagination">
            <li className={this.prevPageClass()}><a href="#">&laquo;</a></li>
            {this.pageButtons()}
            <li className={this.nextPageClass()}><a href="#">&raquo;</a></li>
          </ul>
        </div>
      );
    }
  });

  var Repo = React.createClass({
    render: function() {
      var repo = this.props.repo;

      return (
        <a
          className="list-group-item"
          href={repo.html_url}
          target="_blank"
        >
          {repo.name}
        </a>
      );
    }
  });

  var Repos = React.createClass({
    repos: function() {
      function addRepo(repo) {
        return <Repo key={repo.name} repo={repo} />;
      }

      return this.props.repos.map(addRepo);
    },

    render: function() {
      return (
        <div className="list-group">
          {this.repos()}
        </div>
      );
    }
  });

  var Body = React.createClass({
    render: function() {
      return (
        <div className="container" role="main">
          <FilterResults />
          <Pagination
            pageState={this.props.pageState}
            mainState={this.props.mainState}
          />
          <Repos repos={this.props.pageState.repos} />
        </div>
      );
    }
  });

  // --- page ---

  var UserPage = React.createClass({

    getInitialState: function() {
      return {
        user: {},
        repos: [],
        page: 1
      };
    },

    componentDidMount: function() {
      this.sendGithubQuery();
    },

    sendGithubQuery: function() {
      var self = this, xhrUser, xhrRepos,
          userLogin = this.props.mainState.userLogin,
          newState = {};

      function onUserSuccess(data) {
        newState.user = data;
      }

      function onReposSuccess(data) {
        newState.repos = data;
      }

      function onError(req, txtStatus, err) {
        console.error(err);
      }

      function updateState() {
        self.setState(newState);
      }

      xhrUser = jQuery
        .getJSON("https://api.github.com/users/" + userLogin)
        .done(onUserSuccess)
        .fail(onError);

      xhrRepos = jQuery
        .getJSON(
          "https://api.github.com/users/" +
          userLogin +
          "/repos?page=" +
          this.state.page)
        .done(onReposSuccess)
        .fail(onError);

      jQuery
        .when(xhrUser, xhrRepos)
        .always(updateState)
    },

    componentDidMount: function() {
      this.sendGithubQuery();
    },

    render: function() {
      return (
        <div>
          <Header
            mainState={this.props.mainState}
            mainHandlers={this.props.mainHandlers}
          />
          <Body
            pageState={this.state}
            mainState={this.props.mainState}
          />
        </div>
      );
    }
  });

  global.UserPage = UserPage;

})(this);
