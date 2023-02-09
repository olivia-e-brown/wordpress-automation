import dotenv from 'dotenv';
dotenv.config();

import { OpenAI } from './src/openai/OpenAI.js';
import { Unsplash } from './src/unsplash/Unsplash.js';
import { WordPress } from './src/wordpress/WordPress.js';

const openAI = new OpenAI({
  model: 'text-davinci-003',
  apiKey: process.env.OPENAI_KEY,
});

const wp = new WordPress({
  url: process.env.WP_URL,
  username: 'olivia',
  password: process.env.WP_KEY,
});

const unsplash = new Unsplash(process.env.UNSPLASH_KEY);

// Async function to generate post and retrieve images
async function generatePost(keyword, numberOfTopics, maxTokens) {
  try {
    console.log(`## Generating content for keyword "${keyword}".`);
    // Get post ideas from OpenAI
    const topics = await openAI.getTopicsList(keyword, numberOfTopics, maxTokens);
    console.log(`Openai: Post topics ready.`);

    topics.forEach(async (topic) => {
      // Get the photo
      const photoBuffer = await unsplash.getPhotoBuffer(topic);
      console.log(`Unsplash: Photo ready - ${topic.unsplash_phrase.toLowerCase()}.jpg`);

      const photoResponse = await wp.uploadPhotoBuffer(photoBuffer);

      // Get the content
      const postContent = await openAI.getContent(topic, maxTokens);
      console.log(`Openai: Post content ready - ${topic.title}`);

      // Create a post with the title, content, status and featured media
      const post = {
        title: topic.title,
        content: postContent,
        status: 'draft',
        featured_media: photoResponse.id,
      };
      const postRespones = await wp.createPost(post);
      console.log(`WordPress: Post ready @ ${postRespones.link}`);
    });
  } catch (error) {
    // Log the error if there is any
    console.log(error);
  }
}


generatePost('startup', 2, 500);
