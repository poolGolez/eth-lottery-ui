import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from "./web3"
import lottery from "./lottery";

class App extends React.Component {

  state = {
    manager: "",
    players: [],
    balance: "",
    value: "0.0002",
    winner: ""
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    console.log("Manager:", manager);
    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    console.log("Available accounts:", accounts);

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
      gas: '1000000'
    });
    console.log("Player entered")
  };

  pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    const winner="asdfas";
    await lottery.methods.pickWinner().send({
      from: accounts[0],
      gas: '1000000'
    });

    this.setState({ winner });
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <h6>Web3 version: {web3.version}</h6>
        <p>This contract is managed by {this.state.manager}.</p>
        <p>
          There are currently {this.state.players.length} people entered competing
          to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr/>

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
            value = {this.state.value}
            onChange={event=>this.setState({ value: event.target.value })} />
          </div>
          <button>Enter</button>
        </form>

        <hr/>
        <h4>Time to pick a winner?</h4>
        <button onClick={this.pickWinner}>Pick winner</button>
        <hr/>
        {this.state.winner ?
          (
            <p>The winner is {this.state.winner}</p>
          ) :
          null}

      </div>
    );
  }
}
export default App;
