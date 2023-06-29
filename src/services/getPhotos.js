const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36520633-33601e409e13c629bf4b8ecd8';

export const getPhotos = async (searchQuery, currentPage) => {
  const res = await fetch(
    `${BASE_URL}?q=${searchQuery}&page=${currentPage}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
  );
  const data = await res.json();
  return data;
};
