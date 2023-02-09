import fetch from 'node-fetch';
import { createApi } from 'unsplash-js';

export class Unsplash {
  constructor(accessKey) {
    this.unsplash = createApi({ accessKey, fetch });
    // Default settings for API requests, such as the number of items per page,
    // the orientation of the images, and the current page number
    this.settings = {
      page: 1,
      per_page: 8,
      orientation: 'landscape',
    };
  }

  // Asynchronous method to retrieve a random photo from the Unsplash API with a given search phrase
  async getRandomUnsplashPhoto(query) {
    // Make a call to the Unsplash API's "getPhotos" method
    const response = await this.unsplash.search.getPhotos({
      query,
      page: this.settings.page,
      per_page: this.settings.per_page,
      orientation: this.settings.orientation,
    });

    const results = response.response.results;
    if (!results) {
      throw new Error('No results returned from Unsplash API');
    }

    // Return a random photo from the results array
    return results[Math.floor(Math.random() * results.length)];
  }

  // Method to generate a caption for a photo to attribute the author
  getPhotoCaption(photo) {
    return `Photo by <a href="${photo.user.links.html}" target="_blank" rel="noopener noreferrer">${photo.user.name}</a> on <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>`;
  }

  // Retrieve a photo buffer with a given topic
  async getPhotoBuffer(topic) {
    // Throw error if topic is missing
    if (!topic) {
      throw new Error(`Missing params: Topic`);
    }
    const photoSearchPhase = topic.unsplash_phrase.toLowerCase();
    // Retrieve a random photo from the Unsplash API based on the search phrase
    const photo = await this.getRandomUnsplashPhoto(photoSearchPhase);
    // Get the URL of the photo in its 'regular' size
    const url = photo.urls.regular;
    // Make a fetch request for the photo
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch photo: ${response.statusText}`);
    }
    // Retrieve the buffer of the photo's data
    const buffer = await response.arrayBuffer();
    // Return an object that includes the photo buffer, title, alt text, description, and caption
    return {
      buffer: new Uint8Array(buffer),
      title: photoSearchPhase,
      alt_text: photo.alt_description ? photo.alt_description : '',
      description: photo.description ? photo.description : '',
      caption: this.getPhotoCaption(photo),
    };
  }
}
