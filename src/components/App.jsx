import { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';

import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';

import { getPhotos } from 'services/getPhotos';

export class App extends Component {
  state = {
    searchQuery: '',
    pictures: [],
    status: 'idle',
    page: 1,
    totalImages: 0,
    error: '',
  };

  async componentDidUpdate(prevProps, prevState) {
    const { page, searchQuery } = this.state;

    if (searchQuery !== prevState.searchQuery || page !== prevState.page) {
      this.setState({ status: 'pending' });
      try {
        const data = await getPhotos(searchQuery, page);
        if (!data.totalHits) {
          this.setState({
            status: 'rejected',
            error: 'За даним запитом немає зображень :(',
          });
          return;
        }

        this.setState(prevState => {
          return {
            pictures: [...prevState.pictures, ...data.hits],
            status: 'resolved',
            totalImages: data.totalHits,
          };
        });
      } catch (error) {
        this.setState({
          status: 'rejected',
          error: error.message,
        });
      }
    }
  }

  handleSearchSubmit = searchQuery => {
    this.setState({
      page: 1,
      searchQuery,
      pictures: [],
      totalImages: 0,
    });
  };

  handleLoadMoreClick = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { status, pictures, totalImages, error, page } = this.state;
    const showBtn = totalImages !== pictures.length && page * 12 < 500;
    if (status === 'idle') {
      return (
        <>
          <Searchbar onSubmit={this.handleSearchSubmit} />
        </>
      );
    }
    if (status === 'pending')
      return (
        <>
          <Searchbar onSubmit={this.handleSearchSubmit} />
          {pictures.length > 0 && <ImageGallery pictures={pictures} />}
          <Loader />
        </>
      );
    if (status === 'rejected')
      return (
        <>
          <Searchbar onSubmit={this.handleSearchSubmit} />
          <p>{error}</p>
        </>
      );
    if (status === 'resolved')
      return (
        <>
          <Searchbar onSubmit={this.handleSearchSubmit} />
          <ImageGallery pictures={pictures} />
          {showBtn && <Button onClick={this.handleLoadMoreClick} />}
        </>
      );
  }
}
