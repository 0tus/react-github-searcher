/** @jsx React.DOM */

var USER = {
  "login": "AF83",
  "id": 95956,
  "avatar_url": "https://avatars.githubusercontent.com/u/95956?",
  "gravatar_id": "992d03c980132c2e7a88ce144f1a6600",
  "url": "https://api.github.com/users/AF83",
  "html_url": "https://github.com/AF83",
  "followers_url": "https://api.github.com/users/AF83/followers",
  "following_url": "https://api.github.com/users/AF83/following{/other_user}",
  "gists_url": "https://api.github.com/users/AF83/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/AF83/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/AF83/subscriptions",
  "organizations_url": "https://api.github.com/users/AF83/orgs",
  "repos_url": "https://api.github.com/users/AF83/repos",
  "events_url": "https://api.github.com/users/AF83/events{/privacy}",
  "received_events_url": "https://api.github.com/users/AF83/received_events",
  "type": "Organization",
  "site_admin": false,
  "name": "af83",
  "company": null,
  "blog": "af83.com",
  "location": "Paris",
  "email": null,
  "hireable": null,
  "bio": null,
  "public_repos": 114,
  "public_gists": 0,
  "followers": 0,
  "following": 0,
  "created_at": "2009-06-16T15:18:41Z",
  "updated_at": "2014-05-13T10:12:57Z"
};

var MainPage = React.createClass({

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
      user: USER,
      resultsPerPage: 30,
      route: "search"
    };
  },

  handleUserSelection: function(data) {
    console.log(data);
    //data.route = "user";
    //this.setState(data);
    return false;
  },

  mainHandlers: function() {
    return {
      handleUserSelection: this.handleUserSelection
    };
  },

  render: function() {
    return this.props.routes[this.state.route]({
      mainState: this.state,
      mainHandlers: this.mainHandlers()
    });
  }
});

// Start app
React.renderComponent(<MainPage />, document.getElementById("main"));
