import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { User } from '../api/globals';

axios.defaults.baseURL = `https://sheet.rocks/workbook/${process.env.WORKBOOK_ID}/webhooks/authenticated`;
axios.defaults.validateStatus = () => true;

axios.defaults.validateStatus = function () {
  return true;
};


interface AppProps {
}

interface AppState {
  user: User | null;
  newTask : string;
}

// here's a react App component that renders the text "Sisyphus"

export class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.getUserInfo = this.getUserInfo.bind(this);

    // if token value is in url, set it in localstorage
    let queryParams = new URLSearchParams(window.location.search);
    let token = queryParams.get("token");
    if(token) {
      localStorage.setItem("token", token);

      // remove token from url
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // otherwise, check if token is in localstorage
    token = localStorage.getItem("token");

    // if token is not in localstorage, redirect to login page

    if(!token) {
      window.location.href = `${process.env.ROOT_URL || `https://sheet.rocks/apps/${process.env.WORKBOOK_ID}`}/login`;
      return;
    }

    // set the token in the authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    this.state = {
      user: null,
      newTask : ""
    };
  }

  async componentDidMount() {
    await this.getUserInfo();
  }

  async getUserInfo() {
    // get user info, include the token in the header
    let res = await axios.get(`/user-info`); 

    if(!(res.data && res.data.success)) {
      // if authentication fails, redirect to the login page
      window.location.href = `${process.env.ROOT_URL || `https://sheet.rocks/apps/${process.env.WORKBOOK_ID}`}/login`;
      return;
    }

    let user = res.data.user as User;
    console.log(`user is ${JSON.stringify(user)}`);
    this.setState({user});
  }

  render() {
    return (
      <div className="starter-app">
        <h1>Success!</h1>
        <h2>You have built and deployed your first SheetRocks App!</h2>
      </div>
    );
  }
}

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.render(<App />, rootElement);
} else {
  console.error('Could not find element with ID "root"');
}
