import React from 'react';

import web3 from '../ethereum/web3';
import signverify from '../ethereum/signverify';

class App extends React.Component {
  state = {
    accountAddress: '',
    message: '',
    messageHash: '',
    hashSignature: '',
    signerAddress: '0x00',
    errorMessage: '',
    errorMessage2: '',
    loading: false
  };

  componentDidMount = () => {
    this.loadBlockchainData();
  }

  loadBlockchainData = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ accountAddress: accounts[0] });
  }

  onCreateHashSignature = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, errorMessage: '' });
    try {
      const messageHash = await web3.utils.soliditySha3(this.state.message);
      this.setState({ messageHash });
      const hashSignature = await web3.eth.sign(this.state.messageHash, this.state.accountAddress);
      this.setState({ hashSignature });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  }

  onVerifySignature = (e) => {
    e.preventDefault();
    this.setState({ loading: true, errorMessage2: '' });
    signverify.methods.recover(this.state.messageHash, this.state.hashSignature).send({ from: this.state.accountAddress })
      .on('confirmation', async (confirmationNumber, receipt) => {
        try {
          const signerAddress = await signverify.methods.getSignerAddress().call();
          this.setState({ signerAddress });
        } catch (error) {

        }
        // window.location.reload();
      })
      .on('error', (error, receipt) => {
        this.setState({ errorMessage2: error.message });
      });
    this.setState({ loading: false });
  }

  checkSignatureResult = () => {
    const { accountAddress, signerAddress } = this.state;
    if (accountAddress === signerAddress) {
      return (
        <div className="alert alert-success">
          <strong>Success!</strong><p>Signature Verification Result: { signerAddress } True!</p>
        </div>
      );
    } else {
      return (
        <div className="alert alert-info">
          <p>Signature Verification Result: No Verification...</p>
        </div>
      );
    }
  }

  renderErrorMessage = () => {
    const { errorMessage } = this.state;
    if (errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Danger!</strong><p> Hashing or/and Signing is/are not working properly!</p>
        </div>
      );
    }
  }

  renderErrorMessage2 = () => {
    const { errorMessage2 } = this.state;
    if (errorMessage2) {
      return (
        <div className="alert alert-danger">
          <strong>Danger!</strong><p> Signature Verification is not working properly!</p>
        </div>
      );
    }
  }

  render = () => {
    const { message, messageHash, hashSignature, loading } = this.state;
    return (
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#"><h3>Ethereum React DApp Sign & Verify Messages</h3></a>
        </nav>
        <br />
        <form onSubmit={ this.onCreateHashSignature }>
          <div className="form-group">
            <label>Message</label>
            <input
              className="form-control"
              placeholder="Enter Message"
              value={ message }
              onChange={(e) => this.setState({ message: e.target.value }) }
            />
          </div>
          { this.renderErrorMessage() }
          <button className="btn btn-primary" loading={ loading.toString() }>Create Hash & Signature</button>
        </form>
        <br />
        <div className="alert alert-info">
          <p>Message: { message }</p>
          <p>Message Hash: { messageHash }</p>
          <p>Signature of Hash: { hashSignature }</p>
        </div>
        <br />
        <form onSubmit={ this.onVerifySignature }>
          <div className="form-group">
            <label>Enter Hash of Message</label>
            <input
              className="form-control"
              placeholder="Enter Hash of Message"
              value={ messageHash }
              onChange={(e) => this.setState({ messageHash: e.target.value }) }
            />
          </div>
          <div className="form-group">
            <label>Enter Signature of Hash</label>
            <input
              className="form-control"
              placeholder="Enter Signature of Hash"
              value={ hashSignature }
              onChange={(e) => this.setState({ hashSignature: e.target.value }) }
            />
          </div>
          { this.renderErrorMessage2() }
          <button className="btn btn-primary" loading={ loading.toString() }>Verify Signature</button>
        </form>
        <br />
        { this.checkSignatureResult() }
      </div>
    );
  }
}

export default App;
