import { OpenAI } from "./src/openai/OpenAI.js";
import dotenv from 'dotenv';
dotenv.config();

// Creating a new instance of the OpenAI class and passing in the OPENAI_KEY environment variable
const openAI = new OpenAI(process.env.OPENAI_KEY);

const prompt = 'write a blog post about paris?';
const model = 'text-davinci-003';

// Function to generate the prompt for the OpenAI API 
// In the future, it will be moved to a helper class in the next code review
const generatePrompt = (prompt) => {
    return `Write an blog post about "${prompt}", it should in HTML format, include 5 unique points, using informative tone.`
};

// Use the generateText method to generate text from the OpenAI API and passing the generated prompt, the model and max token value
await openAI.generateText(generatePrompt(prompt), model, 800)
    .then(text => {
        // Logging the generated text to the console
        // In the future, this will be replaced to upload the returned blog text to a WordPress site using the WordPress REST API
        console.log(text);
    })
    .catch(error => {
        console.error(error);
    });



