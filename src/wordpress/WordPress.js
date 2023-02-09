import axios from 'axios';
import FormData from 'form-data';

export class WordPress {
  constructor(wpConfig) {
    this.url = wpConfig.url;
    this.headers = {
      Authorization:
        'Basic ' + Buffer.from(`${wpConfig.username}:${wpConfig.password}`).toString('base64'),
      'Content-Type': 'application/json',
    };
  }

  // Async function to send the post request
  async createPost(post) {
    const response = await axios.post(`${this.url}/wp-json/wp/v2/posts`, post, {
      headers: this.headers,
    });

    return response.data;
  }

  // Async function to send the photo upload request
  async uploadPhotoBuffer(photo) {
    // Create a new FormData object to hold the photo data
    const form = new FormData();
    form.append('file', Buffer.from(photo.buffer), `${photo.title}.jpg`);
    form.append('alt_text', photo.alt_text);
    form.append('description', photo.description);
    form.append('caption', photo.caption);

    // Send a POST request to the API endpoint
    const response = await axios.post(`${this.url}/wp-json/wp/v2/media`, form, {
      headers: {
        ...this.headers,
        'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
      },
    });
    return response.data;
  }
}
