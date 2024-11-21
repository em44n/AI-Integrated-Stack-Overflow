# Integrating AI into Stack Overflow
## Description
This project is a recreation of Stack Overflow, a popular platform for software developers to ask and answer questions. In the previous implementation, we noticed that the website currently was unable to guide users to relevant and accurate answers to their questions. The purpose of our project is to utilize AI to bring more personalization and recommendations to the site, allowing users to find what they're looking for much quicker. To do this, we implemented:
- An AI-based Similar Questions section on the Answer Page for each question and on the page for creating questions, so users can find questions that others may have asked that are similar to their own.
- AI tagging, so questions can be categorized more effectively.
- An AI-based Questions to Answer section for users who are experienced with answering questions to find more questions that their expertise can help answer.
- An AI-generated answer for each question, so that users can get immediate guidance for what they are wondering
- A question and answer translation feature, which utilizes AI translation to enable users who are not English speakers to translate the questions and answers on our website to their native language.
  
## Technologies
The project is built using the ReactJS framework, with Typescript, HTML, and CSS for the front-end. The backend is done using Node.js. The API we used for the AI features was HuggingFace, and within HuggingFace we used the MiniLM model for similiarity, the Qwen2.5 model for text generation, and Facebook's Mbart model for translation. The website's front-end and back-end is hosted on Render and the remote database is on MongoDB.

## Instructions to Run Locally
### Installation
``` cd client
npm install
cd ../server
npm install
cd ../testing
npm install
```
### Usage
``` cd client
npm run start
cd ..
npx ts-node server/server.ts
```
