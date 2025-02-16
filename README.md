# Chatify

## Realtime Chat web application

Chatify is a web application that allows users to communicate with each other in real-time. It leverages modern web technologies to provide a seamless and interactive chat experience. Users can join chat rooms, send messages, and receive updates instantly.

## Tech Stack

1. ![ReactJs](https://img.shields.io/badge/ReactJs-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
2. ![ExpressJs](https://img.shields.io/badge/ExpressJs-000000?style=for-the-badge&logo=express&logoColor=white)
3. ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
4. ![MongoDb](https://img.shields.io/badge/MongoDb-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
5. ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
6. ![TailwindCss](https://img.shields.io/badge/TailwindCss-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Getting Started

### Prerequisites

Make sure you have the following installed:

- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
- ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
- ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

## Contact

For any inquiries or feedback, please contact us:

- ![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white): yvesmugsha09@gmail.com
- ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white): [Yves-Developer](https://github.com/Yves-Developer)
- ![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white): [LinkedLink](https://www.linkedin.com/in/yvesdc)
- ![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white): [portfolioLink](https://yvesdc.vercel.app)

## Inspiring Block of JavaScript Code

```javascript
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
```

## Inspiring Quote

> "Building Chatify was a journey filled with challenges and learning. Every line of code written was a step towards creating a seamless communication platform. The obstacles faced and overcome have only strengthened my resolve and passion for coding. Remember, persistence and dedication are key to turning ideas into reality."
