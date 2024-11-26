# Integrating AI into Stack Overflow
## Description
This project is a recreation of Stack Overflow, a popular platform for software developers to ask and answer questions. In the existing implementation, we noticed that the website was unable to guide users to relevant and accurate answers to their questions. The purpose of our project is to utilize AI to bring more personalization and recommendations to the site, allowing users to find what they're looking for much quicker. To do this, we implemented:
- An AI-based Similar Questions section on the Answer Page for each question and on the page for creating questions, so users can find questions that others may have asked that are similar to their own.
- AI tagging, so questions can be categorized more effectively.
- An AI-based Questions to Answer section for users who are experienced with answering questions to find more questions that their expertise can help answer.
- An AI-generated answer for each question, so that users can get immediate guidance for what they are wondering.
- A question and answer translation feature, which utilizes AI translation to enable users who are not English speakers to translate the questions and answers on the website to their native language.
  
## Technologies
The project is built using the ReactJS framework, with Typescript, HTML, and CSS for the front-end. The backend is done using Node.js. The API we used for the AI features was HuggingFace, and within HuggingFace we used the MiniLM model for similiarity, the Qwen2.5 model for text generation, and Facebook's Mbart model for translation. The website's front-end and back-end are hosted on Render and the remote database is on MongoDB.

## Instructions to Run Locally
### Installation
From the root directory:
``` cd client
npm install
cd ../server
npm install
cd ../testing
npm install
```
When the code is first installed, there may be eslint errors. Run `npm run lint:fix` in the server and client directories in the terminal to fix these.
### Usage
In order to run the project locally, ensure you have MongoDB Compass running in order to access the local database. Connect to `mongodb://localhost:27017/` using MongoDB Compass. You also must set up `.env` files in the client and server directories. In the client directory's `.env` file, add `REACT_APP_SERVER_URL=http://localhost:8000`, or whatever your server URL is. In the server directory's `.env` file add:
```
MONGODB_URI=mongodb://127.0.0.1:27017
CLIENT_URL=http://localhost:3000
PORT=8000
```
or whatever your MongoDB URI, client URL, and port are.

Then run the following lines from the root directory.
```
cd client
npm run start
cd ..
npx ts-node server/server.ts
```
