import React from 'react';
import styles from './Page.scss';

export default class Feature extends React.Component {
  static propTypes = {
    children: React.PropTypes.element.isRequired,
    heading: React.PropTypes.string.isRequired
  };

  render() {
    return (
      <div className={styles.main}>
        <h1 className={styles.heading}>
          {this.props.heading}
        </h1>
        {this.props.children}
      </div>
    );
  }
}
