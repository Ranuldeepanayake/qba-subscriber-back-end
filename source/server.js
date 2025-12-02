const express = require("express");
const server = express();
const port = 3000;

const { printEnvs, amqpSetup } = require("./amqp");
const { getAllQueues } = require("./amqp-stats");

//Print environment variables.
//printEnvs();

//Set up a connection.
//amqpSetup();

server.get("/", (req, res) => {
  res.send("API server is working!");
});

server.get("/api/queue/all", async (req, res) => {
  //res.json({ message: "This is sample data", status: "OK" });
  //  res.status(500).json({
  //     error: err.response?.data || err.message
  //   });
  try{
    console.log("API call received");
    let result = await getAllQueues();
    res.send(result);

  } catch (err) {
    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
