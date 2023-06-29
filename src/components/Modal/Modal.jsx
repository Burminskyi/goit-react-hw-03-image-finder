import { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';

export class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.keyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyDown);
  }

  keyDown = e => {
    if (e.code === 'Escape') {
      this.props.onClose();
    }
  };

  onOverlayClick = e => {
    if (e.currentTarget === e.target) {
      this.props.onClose();
    }
  };

  render() {
    const { picture } = this.props;
    return (
      <div onClick={this.onOverlayClick} className={styles.Overlay}>
        <div className={styles.Modal}>
          <img src={picture.largeImageURL} alt={picture.tags} />
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  picture: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};
