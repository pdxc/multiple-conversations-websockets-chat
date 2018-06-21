# Introduction

This project is a prototype of a websocket chat application for customer service reps to more easily handle multiple conversations at once.

## Features

Users can view all conversations on the left side of the UI. Each conversation has a summary that by default is the last message in the conversation. The user can click on a different message in the message history to change the message displayed on the left hand side. This enables a customer service agent to "pin" the most relevant message in a conversation so it can be in view no matter what conversation they are working in at the moment.

The color of the pinned message's border will change from green to orange to red as the time increases since the last message recorded in the conversation by an agent. This helps agents to prevent customers from being on hold for too long.

# How to run

Clone this repo. Then, `npm install`, `npm run demo`. Then, open your browser to `localhost:8080`, fill out the form for a new agent, and press `Enter`. Then, open a new tab, navigate to `localhost:8080`, fill out the form for a new customer, and press `Enter`. The customer and agent should now be in a new chat.

# TODO

- The code in `src/App.js` should be cleaned up and componentized
- Add functionality for leaving conversations, requesting new conversations with agents, etc.

