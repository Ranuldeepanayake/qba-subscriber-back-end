//Library imports.
const express = require("express");
const amqpSubscriber = require("./amqp-subscriber");
const { getAllQueues, getQueue } = require("./amqp-stats");
const config = require("./config");

const server = express();

config.logInitStart();

//Read env variables.
config.readEnv();

//Print environment variables.
config.printEnvs();

//Create object only after the variables have been loaded.
const subscriber = new amqpSubscriber(config.AMQP_HOST, config.AMQP_MESSAGE_PORT, config.AMQP_USERNAME, config.AMQP_PASSWORD, config.AMQP_DEFAULT_QUEUE_NAME);

//Trust the first proxy in the chain to get the IP address of the real client.
server.set('trust proxy', 1); 

async function startSubscriber() {
  //Set up a connection.
  await subscriber.amqpSetup();
  config.logInitEnd();
  await subscriber.subscribeAmqp();
}

startSubscriber();

server.get("/", (req, res) => {
  res.send("API server is working!");
});

server.get("/api/queue", async (req, res) => {
  try{
    console.log("API request ", req.url, " sent by ", req.ip);
    let result = await getAllQueues();
    res.send(result);

  } catch (err) {
    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
});

server.get("/api/queue/:name", async (req, res) => {
  try{
    const queueName = req.params.name;
    console.log("API request ", req.url, " sent by ", req.ip);
    let result = await getQueue(queueName, config.AMQP_DEFAULT_VHOST);
    res.send(result);

  } catch (err) {
    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
});

server.listen(config.WEB_SERVER_PORT, () => {
  console.info(`Server listening at http://localhost:${config.WEB_SERVER_PORT}`);
});
