// Utility function to generate the prompt for generating a list of blog post topics
export function createTopicsPrompt(keyword, numberOfTopics) {
  if (!keyword || !numberOfTopics) {
    throw new Error(`Params missing - 'keyword' and 'numberOfTopics' must not be null.`);
  }
  return `Generate a list of ${numberOfTopics} unique blog post ideas about ${keyword} 
          in a double-quoted JSON array format, including 'title', 'unsplash_phrase', 'description'.
          Each idea should include a short, SEO-friendly description,
          a unique Unsplash keyword phrase that represents a real-world object with a clear visual.
          `;
}

// Utility function to generate the prompt for generating content for a given blog post topic
export function createContentPrompt(topic) {
  if (!topic) {
    throw new Error(`Params missing - 'topic' must not be null.`);
  }
  return `Write an blog post about ${topic}, it should in HTML format, include 5 unique points, using informative tone.`;
}
