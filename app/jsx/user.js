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

  var PaginationButton = React.createClass({
    handlePageChange: function() {
      if (this.props.page < 1) { return false; }
      this.props.pageHandlers.handlePageChange(this.props.page);
      return false;
    },
    render: function() {
      return (
        <li onClick={this.handlePageChange} className={this.props.klass}>
          <a href="">{this.props.content}</a>
        </li>
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
    prevPageNumber: function() {
      return this.isFirstPage() ? 0 : this.props.pageState.page - 1;
    },
    nextPageNumber: function() {
      return this.isLastPage() ? 0 : this.props.pageState.page + 1;
    },
    pageButtons: function() {
      var i, len, buttonClass, buttons = [];

      for (i = 1, len = this.maxPages(); i <= len; i++) {
        buttonClass = (i === this.props.pageState.page ? "active" : "");
        pageNumber = (i === this.props.pageState.page) ? 0 : i;

        buttons.push(
          <PaginationButton
            key={i}
            page={pageNumber}
            content={i}
            klass={buttonClass}
            pageHandlers={this.props.pageHandlers}
          />
        );
      }

      return buttons;
    },
    render: function() {
      return (
        <div>
          <ul className="pagination">
            <PaginationButton
              page={this.prevPageNumber()}
              content="&laquo;"
              klass={this.prevPageClass()}
              pageHandlers={this.props.pageHandlers}
            />
            {this.pageButtons()}
            <PaginationButton
              page={this.nextPageNumber()}
              content="&raquo;"
              klass={this.nextPageClass()}
              pageHandlers={this.props.pageHandlers}
            />
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
            pageHandlers={this.props.pageHandlers}
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

    handlePageChange: function(page) {
      var self = this;

      function fetchSuccess(repos) {
        self.setState({
          repos: repos,
          page: page
        });
      }

      function fetchError(req, txtStatus, err) {
        console.error(err);
      }

      function cleanXHR() {
        self.pageXHR = null;
      }

      if (this.pageXHR) {
        this.pageXHR.abort();
      }

      jQuery
        .getJSON(
          "https://api.github.com/users/" +
          this.props.mainState.userLogin +
          "/repos?page=" +
          page)
        .done(fetchSuccess)
        .fail(fetchError)
        .always(cleanXHR);
    },

    pageHandlers: function() {
      return {
        handlePageChange: this.handlePageChange
      };
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
            pageHandlers={this.pageHandlers()}
          />
        </div>
      );
    }
  });

  global.UserPage = UserPage;

})(this);
