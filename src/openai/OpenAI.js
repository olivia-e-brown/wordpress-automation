import { Configuration, OpenAIApi } from 'openai'
import logger from '../utils/logger.js'

export class OpenAI {
  constructor (apiKey) {
    // Create the Configuration and OpenAIApi instances
    this.openai = new OpenAIApi(new Configuration({ apiKey }))
  }

  // Asynchronous function to generate text from the OpenAI API
  async generateText (prompt, model, max_tokens, temperature = 0.85) {
    try {
      // Log the prompt being sent to the API
      logger.info(`Sending request to OpenAI API with prompt: ${prompt}`)
      // Send a request to the OpenAI API to generate text
      const response = await this.openai.createCompletion({
        model,
        prompt,
        max_tokens,
        n: 1,
        temperature
      })
      // Log that a response has been received
      logger.info('Received response from OpenAI API')
      console.log(`request cost: ${response.data.usage.total_tokens} tokens`)
      // Return the text of the response
      return response.data.choices[0].text
    } catch (error) {
      // Log the error if there is any
      logger.error(`Error generating text: ${error.message}`)
      throw error
    }
  }
}
