//Library imports.
require('dotenv').config();
const axios = require("axios");
const config = require("./config");

//Get stats of all queues.
async function getAllQueues() {
  let amqpUrl = `http://${config.AMQP_HOST}:${config.AMQP_API_PORT}/api/queues`;

  try{
    console.info("Sending request to AMQP server ", amqpUrl);
    const result = await axios.get(amqpUrl, { auth: {username: config.AMQP_USERNAME, password: config.AMQP_PASSWORD }});
    console.info("Response received from AMQP server ", amqpUrl);
    return result.data;

  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}
//getAllQueues().then(console.log);

// Get stats for a specific queue
async function getQueue(queueName, vhost = config.AMQP_DEFAULT_VHOST) {
  try {
    const amqpUrl = `http://${config.AMQP_HOST}:${config.AMQP_API_PORT}/api/queues/${encodeURIComponent(vhost)}/${queueName}`;

    console.info("Sending request to AMQP server ", amqpUrl);
    const result = await axios.get(amqpUrl, { auth: {username: config.AMQP_USERNAME, password: config.AMQP_PASSWORD }});
    console.info("Response received from AMQP server ", amqpUrl);
    return result.data;

  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

module.exports = { getAllQueues, getQueue };
