/** @jsx React.DOM */

(function(global) {

  // --- header ---

  var Header = React.createClass({
    render: function() {
      return (
        <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand">Github Repos Navigator</a>
            </div>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="#">New Search</a>
              </li>
            </ul>
          </div>
        </div>
      );
    }
  });

  // --- body ---

  var FilterResults = React.createClass({
    render: function() {
      return (
        <div></div>
      );
    }
  });

  var Pagination = React.createClass({
    maxPages: function() {
      return Math.ceil(this.props.user.public_repos / this.props.resultsPerPage);
    },
    isFirstPage: function() {
      return this.props.page === 1;
    },
    isLastPage: function() {
      return this.props.page === this.maxPages()
    },
    prevPageClass: function() {
      return this.isFirstPage() ? "disabled" : "";
    },
    nextPageClass: function() {
      return this.isLastPage() ? "disabled" : "";
    },
    render: function() {
      return (
        <div>
          <ul className="pagination">
            <li className={this.prevPageClass()}><a href="#">&laquo;</a></li>
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
        <a className="list-group-item" href={repo.html_url}>{repo.name}</a>
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
            user={this.props.mainState.user}
            resultsPerPage={this.props.mainState.resultsPerPage}
            page={this.props.pageState.page}
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
        repos: [],
        page: 1
      };
    },

    sendGithubQuery: function() {
      var self = this;

      function onSuccess(data) {
        self.setState({
          repos: data || []
        });
      }

      function onError(req, txtStatus, err) {
        console.error(err);
      }

      jQuery
        .ajax({
          url: "https://api.github.com/users/" +
               this.props.mainState.user.login +
               "/repos?page=" +
               this.state.page,
          dataType: "json"
        })
        .done(onSuccess)
        .fail(onError);
    },

    componentDidMount: function() {
      this.sendGithubQuery();
    },

    render: function() {
      return (
        <div>
          <Header />
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
