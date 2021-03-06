import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  CircularProgress
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import Web3 from 'web3'
import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError
} from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";
import {
  URI_AVAILABLE,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect
} from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import { useEagerConnect, useInactiveListener } from "./hooks";

import {
  walletconnect,
  fortmatic,
  portis,
  torus,
} from "../../stores/connectors";

import {
  ERROR,
  // CONNECT_METAMASK,
  // METAMASK_CONNECTED,
  // CONNECT_LEDGER,
  // LEDGER_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONNECTION_CONNECTED
} from '../../constants'

import Store from "../../stores";
const dispatcher = Store.dispatcher
const emitter = Store.emitter
const store = Store.store



const styles = theme => ({
  root: {
    flex: 1,
    height: 'auto',
    display: 'flex',
    position: 'relative'
  },
  contentContainer: {
    margin: 'auto',
    textAlign: 'center',
    padding: '12px',
    display: 'flex',
    flexWrap: 'wrap'
  },
  cardContainer: {
    marginTop: '60px',
    minHeight: '260px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  unlockCard: {
    padding: '24px'
  },
  metamaskIcon: {
    backgroundImage: 'url('+require('../../assets/icn-metamask.svg')+')',
    width: '30px',
    height: '30px'
  },
  ledgerIcon: {
    backgroundImage: 'url('+require('../../assets/icn-ledger.svg')+')',
    width: '30px',
    height: '30px'
  },
  buttonText: {
    marginLeft: '12px',
    fontWeight: '700',
  },
  instruction: {
    maxWidth: '400px',
    marginBottom: '32px',
    marginTop: '32px'
  },
  metamask: {
    backgroundImage: 'url('+require('../../assets/metamask.svg')+')',
    width: '200px',
    height: '200px'
  },
  ledger: {
    backgroundImage: 'url('+require('../../assets/icn-ledger.svg')+')',
    backgroundSize: '100%',
    width: '200px',
    height: '200px'
  },
  actionButton: {
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '3rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  connect: {
    width: '100%'
  },
  closeIcon: {
    position: 'fixed',
    right: '12px',
    top: '12px',
    cursor: 'pointer'
  }
});

class Unlock extends Component {

  constructor(props) {
    super()

    this.state = {
      error: null,
      metamaskLoading: false,
      ledgerLoading: false
    }
  }

  componentWillMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(ERROR, this.error);
  };

  componentWillUnmount() {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(ERROR, this.error);
  };

  navigateInvest = () => {
    this.props.history.push('/invest')
  }

  // unlockMetamask = () => {
  //   this.setState({ metamaskLoading: true })
  //   dispatcher.dispatch({ type: CONNECT_METAMASK, content: {} })
  // }
  //
  // unlockLedger = () => {
  //   this.setState({ ledgerLoading: true })
  //   dispatcher.dispatch({ type: CONNECT_LEDGER, content: {} })
  // }

  error = (err) => {
    this.setState({ loading: false, error: err, metamaskLoading: false, ledgerLoading: false })
  };

  connectionConnected = () => {
    if(this.props.closeModal != null) {
      this.props.closeModal()
    }
  }

  connectionDisconnected = () => {
    if(this.props.closeModal != null) {
      this.props.closeModal()
    }
  }

  metamaskUnlocked = () => {
    this.setState({ metamaskLoading: false })
    if(this.props.closeModal != null) {
      this.props.closeModal()
    }
  }

  ledgerUnlocked = () => {
    this.setState({ ledgerLoading: false })
    if(this.props.closeModal != null) {
      this.props.closeModal()
    }
  }

  cancelLedger = () => {
    this.setState({ ledgerLoading: false })
  }

  cancelMetamask = () => {
    this.setState({ metamaskLoading: false })
  }

  render() {
    const { classes, closeModal } = this.props;
    const { metamaskLoading, ledgerLoading } = this.state;

    return (
      <div className={ classes.root }>
        <div className={ classes.closeIcon } onClick={ closeModal }><CloseIcon /></div>
        <div className={ classes.contentContainer }>
          { /* metamaskLoading && this.renderMetamaskLoading() */ }
          { /* ledgerLoading && this.renderLedgerLoading() */ }
          { /* (!metamaskLoading && !ledgerLoading) && this.renderOptions() */ }
          { /* (!metamaskLoading && !ledgerLoading && closeModal != null) && <Button className={ classes.actionButton } variant='outlined' color='secondary' onClick={ closeModal } fullWidth>
            <Typography className={ classes.buttonText } variant={ 'h5'}>Close</Typography>
          </Button> */ }


          <Web3ReactProvider getLibrary={getLibrary}>
            <MyComponent closeModal={ closeModal} />
          </Web3ReactProvider>
        </div>
      </div>
    )
  };

  renderMetamaskLoading = () => {
    const { classes } = this.props;

    return (<div className={ classes.cardContainer }>
      <div className={ classes.metamask }>
      </div>
      <Typography variant={ 'h3'} className={ classes.instruction }>
        Click connect in the MetaMask notification window to connect your wallet to iearn finance.
      </Typography>
      <Button className={ classes.actionButton } variant='outlined' color='primary' onClick={ this.cancelMetamask } fullWidth>
        <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Cancel</Typography>
      </Button>
    </div>)
  };

  renderLedgerLoading = () => {
    const { classes } = this.props;

    return (<div className={ classes.cardContainer }>
      <div className={ classes.ledger }>
      </div>
      <Typography variant={ 'h3'} className={ classes.instruction }>
        Insert yout ledger device and authorize iEarn.
      </Typography>
      <Button className={ classes.actionButton } variant='outlined' color='primary' onClick={ this.cancelLedger } fullWidth>
        <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Cancel</Typography>
      </Button>
    </div>)
  }

  renderOptions = () => {
    const { classes, closeModal } = this.props;
    const connectorsByName = store.getStore('connectorsByName')

    return Object.keys(connectorsByName).map((name) => {
      return (<Button className={ classes.actionButton } variant='outlined' color='primary' onClick={ () => { this.unlockConnector(name) } } fullWidth>
        <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Unlock using {name}</Typography>
      </Button>)
    })

    // return (
    //   <div className={ classes.cardContainer }>
    //     <Button className={ classes.actionButton } variant='outlined' color='primary' onClick={ this.unlockMetamask } fullWidth>
    //       <div className={ classes.metamaskIcon }></div>
    //       <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Unlock using Metamask</Typography>
    //     </Button>
    //     <Button className={ classes.actionButton } variant='outlined' color='primary' onClick={ this.unlockLedger } fullWidth>
    //       <div className={ classes.ledgerIcon }></div>
    //       <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Unlock using Ledger</Typography>
    //     </Button>
    //     { closeModal != null && <Button className={ classes.actionButton } variant='outlined' color='secondary' onClick={ closeModal } fullWidth>
    //       <Typography className={ classes.buttonText } variant={ 'h5'}>Close</Typography>
    //     </Button> }
    //   </div>
    // )
  };
}

function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

function getLibrary(provider) {

  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

function onConnectionClicked(currentConnector, name, setActivatingConnector, activate) {
  const connectorsByName = store.getStore('connectorsByName')
  setActivatingConnector(currentConnector);
  activate(connectorsByName[name]);
}

function onDeactivateClicked(deactivate, connector) {
  if(deactivate) {
    deactivate()
  }
  if(connector && connector.close) {
    connector.close()
  }
  store.setStore({ account: { }, web3context: null })
  emitter.emit(CONNECTION_DISCONNECTED)
}

function MyComponent(props) {

  const context = useWeb3React();
  const localContext = store.getStore('web3context');
  var localConnector = null;
  if (localContext) {
    localConnector = localContext.connector
  }
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error
  } = context;
  const connectorsByName = store.getStore('connectorsByName')

  console.log(localContext);

  const { closeModal } = props

  const [activatingConnector, setActivatingConnector] = React.useState();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  React.useEffect(() => {
    if (account && active && library) {
      console.log("we are active: "+account)
      store.setStore({ account: { address: account }, web3context: context })
      emitter.emit(CONNECTION_CONNECTED)
    }
  }, [account, active, closeModal]);

  // React.useEffect(() => {
  //   if (storeContext && storeContext.active && !active) {
  //     console.log("we are deactive: "+storeContext.account)
  //     store.setStore({ account: {}, web3context: null })
  //   }
  // }, [active, storeContext]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);
  const width = window.innerWidth

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: (width > 650 ? 'space-between' : 'center'), alignItems: 'center' }}>
      {Object.keys(connectorsByName).map(name => {
        const currentConnector = connectorsByName[name];
        const activating = currentConnector === activatingConnector;
        const connected = (currentConnector === connector||currentConnector === localConnector);
        const disabled =
          !triedEager || !!activatingConnector || !!error;

        var url;
        var display = name;
        if (name == 'Injected') {
          display = 'MetaMask';
          url = require('../../assets/icn-metamask.svg')
        } else if (name == 'WalletConnect') {
          url = require('../../assets/walletConnectIcon.svg')
        } else if (name == 'Portis') {
          url = require('../../assets/portisIcon.png')
        } else if (name == 'Fortmatic') {
          url = require('../../assets/fortmaticIcon.png')
        } else if (name == 'Ledger') {
          url = require('../../assets/icn-ledger.svg')
        } else if (name == 'Squarelink') {
          url = require('../../assets/squarelink.png')
        } else if (name == 'Trezor') {
          url = require('../../assets/trezor.png')
        } else if (name == 'Torus') {
          url = require('../../assets/torus.jpg')
        } else if (name == 'WalletLink') {
          display = 'Coinbase Wallet'
          url = require('../../assets/coinbaseWalletIcon.svg')
        } else if (name == 'Frame'||name == 'Authereum') {
          return ''
        }

        return (
          <div style={{ padding: '12px 0px', display: 'flex', justifyContent: 'space-between'  }}>
            <Button style={ {
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '1rem',

                border: '1px solid #E1E1E1',
                fontWeight: 500,
                display: 'flex',
                justifyContent: 'space-between'
              } }
              variant='outlined'
              color='primary'
              onClick={() => {
                onConnectionClicked(currentConnector, name, setActivatingConnector, activate)
              }}
              disabled={ disabled }>
              <Typography style={ {
                  margin: '0px 12px',
                  color: 'rgb(1, 1, 1)',
                  fontWeight: 500,
                  fontSize: '1rem',
                } }
                variant={ 'h3'}>
                { display }
              </Typography>

              { (!activating && !connected) && <img style={
                {
                  position: 'absolute',
                  right: '20px',

                  width: '30px',
                  height: '30px'
                }
              } src={url}/> }
              { activating && <CircularProgress size={ 15 } style={{marginRight: '10px'}} /> }
              { (!activating && connected) && <div style={{ background: '#4caf50', borderRadius: '10px', width: '10px', height: '10px', marginRight: '10px' }}></div> }
            </Button>
          </div>
        )
      }) }

      <div style={{ width: '252px', margin: '12px 0px'  }}>
        <Button style={ {
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '20px',
            border: '1px solid #E1E1E1',
            fontWeight: 500
          } }
          variant='outlined'
          color='primary'
          onClick={() => { onDeactivateClicked(deactivate, connector); }}>
          <Typography style={ {
              marginLeft: '12px',
              fontWeight: '700',
              color: '#DC6BE5'
            } }
            variant={ 'h5'}
            color='primary'>
            Deactivate
          </Typography>
        </Button>
      </div>
    </div>
  )

}



export default withRouter(withStyles(styles)(Unlock));
