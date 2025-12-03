//Library imports.
const express = require("express");
const { printEnvs, amqpSetup } = require("./amqp");
const { getAllQueues, getQueue } = require("./amqp-stats");
const config = require("./config");

const server = express();
const port = 3000;

//Read env variables.
config.readEnv();

//Print environment variables.
config.printEnvs();

//Set up a connection.
//amqpSetup();

//Trust the first proxy in the chain to get the IP address of the real client.
//server.set('trust proxy', 1); 

server.get("/", (req, res) => {
  res.send("API server is working!");
});

server.get("/api/queue/all", async (req, res) => {
  try{
    console.log("API request received by ", req.ip);
    let result = await getAllQueues();
    res.send(result);

  } catch (err) {
    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
});

server.get("/api/queue/:name", async (req, res) => {
  const queueName = req.params.name;
  console.log

  try{
    console.log("API request ", queueName, " received by ", req.ip);
    let result = await getQueue(queueName, config.AMQP_DEFAULT_VHOST);
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
