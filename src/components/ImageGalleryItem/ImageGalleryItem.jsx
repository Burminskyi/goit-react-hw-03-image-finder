import { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ImageGalleryItem.module.css';
import { Modal } from 'components/Modal/Modal';

export class ImageGalleryItem extends Component {
  state = {
    showModal: false,
  };

  onModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  render() {
    const { picture } = this.props;
    const { webformatURL, tags } = picture;
    const { showModal } = this.state;

    return (
      <li className={styles.ImageGalleryItem}>
        <img
          onClick={this.onModal}
          className={styles.ImageGalleryItemImage}
          src={webformatURL}
          alt={tags}
        />
        {showModal && <Modal picture={picture} onClose={this.onModal} />}
      </li>
    );
  }
}

ImageGalleryItem.propTypes = {
  picture: PropTypes.object.isRequired,
};
