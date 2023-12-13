import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { User } from '../api/globals';
import Form, { FormData } from './form';

axios.defaults.baseURL = `https://sheet.rocks/workbook/${process.env.WORKBOOK_ID}/webhooks/authenticated`;
axios.defaults.validateStatus = () => true;

axios.defaults.validateStatus = function () {
  return true;
};

enum Mode {
  DASHBOARD = "dashboard",
  FORM = "form",
}


interface AppProps {
}

interface AppState {
  mode: Mode;
  user: User | null;
  newTask : string;
  formData: FormData[];
  editingFormData: FormData | null;
}

// here's a react App component that renders the text "Sisyphus"

export class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.getUserInfo = this.getUserInfo.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.toast = this.toast.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.renderDashboard = this.renderDashboard.bind(this);

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
      mode: Mode.DASHBOARD,
      user: null,
      newTask : "",
      formData: [],
      editingFormData: null,
    };
  }

  async componentDidMount() {
    await this.getUserInfo();
    await this.getFormData();
  }

  async getFormData() {
    // get the form data from the sheet
    let res = await axios.get(`/form`);
    if(!(res.data && res.data.success)) {
      this.toast("Encountered an error.");
      return;
    }

    let formData = res.data.formData as FormData[];
    this.setState({formData});
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

  async toast(msg :string) {
    // show a toast message
    let toast = document.getElementById("toast") as HTMLDivElement;
    toast.innerText = msg;
    toast.style.display = "block";
    toast.className = "toast";

    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  }

  async handleDelete(id :string) {
    // delete the form data from the sheet
    await axios.delete(`/form?formId=${id}`);
    await this.getFormData();
    this.toast("Entry deleted!");
  }

  renderDashboard() {
    const { formData } = this.state;
    return  <><h1>My Progress</h1>
                {formData.length > 0 && <table>
                  <thead>
                    <tr>
                      <th>Widget Count</th>
                      <th>Submission Date</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.map((fd, index) => (
                      <tr key={index}>
                        <td>{fd.widgetCount}</td>
                        <td>{fd.submissionDate}</td>
                        <td><button className="edit-form" onClick={() => this.setState({ editingFormData: fd, mode: Mode.FORM})}>Edit</button></td>
                        <td><button className="delete-form" onClick={() => this.handleDelete(fd.id)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>}

                {formData.length === 0 && <p><em>No submissions yet.</em></p>}

                <button className="new-report" onClick={() => this.setState({mode: Mode.FORM, editingFormData: null})}>+ New Report</button>
        </>
  }

  render() {
    return (
      <div className="starter-app-forms">
        {this.state.mode === Mode.DASHBOARD && this.renderDashboard()}
        {this.state.mode === Mode.FORM && <Form toast={this.toast} close={() => this.setState({ mode: Mode.DASHBOARD }, this.getFormData)} editingFormData={this.state.editingFormData} />}
        <div id="toast" className="toast"></div>
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
