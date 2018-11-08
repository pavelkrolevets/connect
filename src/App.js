import React, { Component } from 'react';
import logo from './logo.svg';
import './global';
import {decodeFromHex, encodeToHex} from './hexutils';

import './App.css';
import Web3 from 'web3'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ID: 'nope',
            node_addr: '0xb47f736b9b15dcc888ab790c38a6ad930217cbee',
            client_addr: '0xc29553e4d9b2d1ffde5d89763dcc6bfaa0e006c3',
            client_priv_key: 'd81952d9449a63525e2ef643e1b4ef7be924ac5a37602f00677c9940fa20d4cf',
        };
        this.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
        console.log(this.web3);
        this._doSomething = this._doSomething.bind(this)

    }

    UNSAFE_componentWillMount() {
        if(this.web3) {
            this.web3.eth.net.getId().then(id =>
            this.setState({ID:id})
            )
        }
    }

    _doSomething(){
        console.log(this.web3.eth.getAccounts());
        this.web3.eth.getBalance(this.state.node_addr).then(balance => console.log('Node BALANCE',this.web3.utils.fromWei(balance, 'ether')));
        this.web3.eth.getBalance(this.state.client_addr).then(balance => console.log('Client BALANCE',this.web3.utils.fromWei(balance, 'ether')));

        // this.web3.eth.personal.unlockAccount(this.state.node_addr, "extreme8811", 600)
        //     .then(console.log('Account unlocked!'));

        var Tx = require('ethereumjs-tx');
        const privateKey = new Buffer(this.state.client_priv_key, 'hex');

        this.web3.eth.getTransactionCount(this.state.client_addr).then(txCount =>{
            console.log(txCount);
            const rawTx = {
                type: 0,
                nonce: this.web3.utils.toHex(txCount),
                gas: 21000,
                gasPrice: 25000,
                to: '0xd08A05283aD35600Ab448C08Db31A7c3797c8319',
                value: 10000,

            };

            var tx = new Tx(rawTx);
            console.log(tx);
            tx.sign(privateKey);
            console.log('Valid signature? :',tx.verifySignature());
            // console.log('V :',tx.v.toString('Hex'));
            // console.log('Sender :',tx.from.toString('Hex'));
            console.log('Sender :',tx.getAddress().toString('Hex'));

            var serializedTx = tx.serialize();
            console.log(serializedTx.toString("Hex"));
            // var txDecoder = require('ethereum-tx-decoder');
            // var decodedTx = txDecoder.decodeTx('0x'+serializedTx.toString("Hex"));
            // console.log('Decoded Tx', decodedTx);

            this.web3.eth.sendSignedTransaction('0x'+serializedTx.toString('Hex'))
                .on('receipt', console.log);
        });

    }

  render() {
    return (
      <div>
          <h2>Version:</h2><br/>
          {this.state.ID}<br/><br/>
          <button onClick={this._doSomething}>Click</button>
      </div>
    );
  }
}

export default App;
