import React from 'react';
import 'normalize.css/normalize.css';
import 'react-mdl/extra/css/material.cyan-red.min.css';
import Navbar from '../Navbar/NavbarComponent';
import Footer from '../Footer/FooterContainer';
import styles from './App.scss';
import dogSniffer from '../../assets/dogSniffer.png';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.greeting}>
          <h1 className={styles.sawasdee}>Welcome to Snout!</h1>
          <p>An online shopper&#39;s best friend</p>
          <img src={dogSniffer} width='200' alt='dogSniffer' />
        </div>
        <div className={styles.content}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
