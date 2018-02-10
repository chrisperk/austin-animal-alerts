import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {users: []}

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => {
        users = users.filter(user => {
          return new Date(user.datetime).getFullYear() >= 2018;
        });
        this.setState({ users });
        console.log(this.state.users);
      });
  }

  render() {
    return (
      <div className="App">
        <h1>Users</h1>
        {this.state.users.map(user => 
          <div key={user.id}>{new Date(user.datetime).getFullYear()}</div>
        )}
      </div>
    );
  }
}

export default App;
