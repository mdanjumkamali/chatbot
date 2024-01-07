// Load environment variables from a .env file
import "dotenv/config";

// Import the 'readline' module for handling user input
import readline from "node:readline";

// Import the OpenAI library
import OpenAI from "openai";

// Create a readline interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Initialize OpenAI with the API key from the environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to send a new message to the OpenAI chat model
const newMessage = async (history, message) => {
  // Call the OpenAI API to generate a chat completion
  const chatCompletion = await openai.chat.completions.create({
    messages: [...history, message],
    model: "gpt-3.5-turbo",
  });

  // Return the content of the generated response
  return chatCompletion.choices[0].message;
};

// Function to format user input as a message object
const formatMessage = (userInput) => ({ role: "user", content: userInput });

// Main chat function
const chat = () => {
  // Initial conversation history with a system message
  const history = [
    {
      role: "system",
      content: `You are a helpful AI assistant. Answer the user's questions to the best of your ability.`,
    },
  ];

  // Function to start the conversation loop
  const start = () => {
    // Prompt the user for input
    rl.question("You: ", async (userInput) => {
      // Check if the user wants to exit the chat
      if (userInput.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      // Format the user input as a message object
      const userMessage = formatMessage(userInput);

      // Get a response from the OpenAI chat model
      const response = await newMessage(history, userMessage);

      // Update the conversation history with user input and AI response
      history.push(userMessage, response);

      // Display the AI's response
      console.log(`\n\nAI: ${response.content}\n\n`);

      // Continue the conversation loop
      start();
    });
  };

  // Start the initial conversation
  start();
  console.log("\n\nAI: How can I help you today?\n\n");
};

// Display a message indicating that the chatbot is initialized
console.log("Chatbot initialized. Type 'exit' to end the chat.");

// Start the chat function
chat();
