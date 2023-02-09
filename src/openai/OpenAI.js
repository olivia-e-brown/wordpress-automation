import { Configuration, OpenAIApi } from 'openai';
import { createTopicsPrompt, createContentPrompt } from './prompt.js';

export class OpenAI {
  /**
   * Class constructor for the OpenAI Service
   * @param {object} config - Configuration object for the OpenAI Service
   * @param {string} config.model - The OpenAI model to use for text generation
   * @param {string} config.apiKey - The API Key to use when connecting to OpenAI API
   */
  constructor(config) {
    this.model = config.model;
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey: config.apiKey,
      }),
    );
  }

  // Asynchronous function to generate text from the OpenAI API
  async generateText(prompt, max_tokens, temperature = 0.7) {
    // Send a request to the OpenAI API to generate text
    const response = await this.openai.createCompletion({
      model: this.model,
      prompt,
      max_tokens,
      n: 1,
      temperature,
    });
    return response.data.choices[0].text;
  }

  // Asynchronous function to get a list of topics from the OpenAI API
  async getTopicsList(keyword, numberOfTopics, maxTokens = 300) {
    // Validate the inputs
    if (!keyword || !numberOfTopics) {
      throw new Error(`Params missing - 'keyword' and 'numberOfTopics' must not be null.`);
    }
    // Create the prompt for the OpenAI API
    const topicsPrompt = createTopicsPrompt(keyword, numberOfTopics);
    // Get the topics list from the OpenAI API
    const topicsList = await this.generateText(topicsPrompt, maxTokens);
    return JSON.parse(topicsList);
  }

  // Asynchronous function to get the content for a given topic
  async getContent(topic, maxTokens = 300) {
    // Validate that the topic is not null
    if (!topic) {
      throw new Error(`Params missing - 'topic'  must not be null.`);
    }
    // Create a content prompt from the topic title
    const contentPrompt = createContentPrompt(topic.title);
    // Call the generateText function with the content prompt and max tokens
    const content = await this.generateText(contentPrompt, maxTokens);
    return content;
  }
}
