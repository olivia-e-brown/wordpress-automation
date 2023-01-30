import { OpenAI } from "./src/openai/OpenAI.js";
import { Unsplash } from "./src/unsplash/Unsplash.js";
import logger from './src/utils/logger.js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Creating a new instance of the OpenAI class and passing in the OPENAI_KEY environment variable
const openAI = new OpenAI(process.env.OPENAI_KEY);
const unsplash = new Unsplash(process.env.UNSPLASH_KEY);

const topic = 'NodeJs';
const model = 'text-davinci-003';

// Function that returns the OpenAI prompt based on the specified parameters
const createOpenAiPrompt = (numberOfIdeas = 0, topic) => {
    if(numberOfIdeas > 0 ) {
        // Generate a list of unique blog post ideas about the topic
        return `Generate a list of ${numberOfIdeas} unique blog post ideas about ${topic} 
                in a double-quoted JSON array format, including 'title', 'unsplash_phrase', 'description'.
                Each idea should include a short, SEO-friendly description,
                a unique Unsplash keyword phrase that represents a real-world object with a clear visual.
                `
    } else {
        // Write a blog post about the topic
        return `Write an blog post about "${topic}", it should in HTML format, include 5 unique points, using informative tone.`
    }
};

// Async function to generate post and retrieve images
async function generatePost() {   
    try {
        // Get post ideas from OpenAI
        const ideasData = await openAI.generateText(createOpenAiPrompt(5, topic), model, 800)
        const ideas = JSON.parse(ideasData);
        console.log(ideas)

        // For each post idea, get the photo and content
        ideas.forEach(async (idea) => {
            // Get the photo
            await unsplash.getPhoto('file', idea);

            // Get the post content
            await openAI.generateText(createOpenAiPrompt(idea.title), model, 800)
                .then(text => {
                    // Write the content to a file in the respective post directory
                    const filePath = `src/post/${idea.title}/${idea.title}.txt`
                    fs.promises.writeFile(filePath, text);
                }) 

            console.log(`Post saved - '${idea.title}'.`)
        })
    } catch (error) {
        // Log the error if there is any
        logger.error(`Error generating text: ${error.message}`);
        throw error;
    }
}

generatePost();

