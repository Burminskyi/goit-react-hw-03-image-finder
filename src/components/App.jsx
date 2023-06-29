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
    btnIsShown: true,
    error: '',
  };

  async componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevState.searchQuery;
    const currentQuery = this.state.searchQuery;
    const prevPage = prevState.page;
    const currentPage = this.state.page;

    if (prevQuery !== currentQuery) {
      try {
        this.setState({ status: 'pending' });
        const data = await getPhotos(currentQuery, currentPage);
        if (data.hits.length > 0 && data.total < currentPage * 12) {
          this.setState({
            pictures: data.hits,
            status: 'resolved',
            btnIsShown: false,
          });
        } else if (data.hits.length > 0 && data.total > currentPage * 12) {
          this.setState({
            pictures: data.hits,
            status: 'resolved',
            btnIsShown: true,
          });
        } else if (data.totalHits === 0) {
          this.setState({
            status: 'rejected',
            btnIsShown: false,
            error: 'По данному запросу нет изображений :(',
          });
        }
      } catch (error) {
        console.log(error);
        this.setState({
          status: 'rejected',
          error: error.message,
        });
      }
    }

    if (prevPage !== currentPage && prevQuery === currentQuery) {
      try {
        this.setState({ status: 'pending' });
        const data = await getPhotos(currentQuery, currentPage);
        if (
          (data.hits.length > 0 && data.total < this.state.page * 12) ||
          (data.hits.length > 0 && data.total < this.state.page * 12)
        ) {
          this.setState({ status: 'pending' });
          this.setState(prevState => {
            return {
              pictures: [...prevState.pictures, ...data.hits],
              btnIsShown: false,
              status: 'resolved',
            };
          });
        } else if (data.hits.length > 0 && data.total > this.state.page * 12) {
          this.setState(prevState => {
            return {
              pictures: [...prevState.pictures, ...data.hits],
              btnIsShown: true,
              status: 'resolved',
            };
          });
        }
      } catch (error) {
        console.log(error);
        this.setState({ status: 'rejected', error: error.message });
      }
    }
  }

  handleSearchSubmit = searchQuery => {
    this.setState({
      page: 1,
      searchQuery,
    });
  };

  handleLoadMoreClick = () => {
    this.setState({ page: this.state.page + 1 });
  };

  render() {
    const { status, pictures, btnIsShown, error } = this.state;
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
          {pictures !== [] && <ImageGallery pictures={pictures} />}
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '15px',
            margin: 'auto',
            alignContent: 'center',
          }}
        >
          <Searchbar onSubmit={this.handleSearchSubmit} />
          <ImageGallery pictures={pictures} />
          {btnIsShown && <Button onClick={this.handleLoadMoreClick} />}
        </div>
      );
  }
}
