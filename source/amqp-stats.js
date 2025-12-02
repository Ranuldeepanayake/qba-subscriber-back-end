require('dotenv').config();
const axios = require("axios");

const AMQP_HOST = process.env.RABBITMQ_HOST || '192.168.56.129';
const AMQP_PORT = process.env.RABBITMQ_PORT || '15672';
const AMQP_USERNAME = process.env.RABBITMQ_USERNAME || 'ranul';
const AMQP_PASSWORD = process.env.RABBITMQ_PASSWORD || 'ranul@123';
const QUEUE_NAME = process.env.QUEUE_NAME || 'QBA_QUEUE_1';

//const RABBIT_HOST = "http://localhost:15672";
//const USER = "guest";
//const PASS = "guest";

//Get stats of all queues.
async function getAllQueues() {
  let amqpUrl = `http://${AMQP_HOST}:${AMQP_PORT}/api/queues`;

  try{
    console.info("Sending request to ", amqpUrl);
    const result = await axios.get(amqpUrl, { auth: {username: AMQP_USERNAME, password: AMQP_PASSWORD }});
    console.info("Response received from ", amqpUrl);
    return result.data;

  } catch (err) {
    console.error(err.message);
    throw new Error(err);
    //return "Error 500";
  }
}

//getAllQueues().then(console.log);

// ///////////////////////////
// // Get stats for a specific queue
// app.get("/queue/:name", async (req, res) => {
//   const queueName = req.params.name;

//   try {
//     const url = `${RABBIT_HOST}/api/queues/%2F/${queueName}`;
//     const result = await axios.get(url, axiosConfig);
//     res.json(result.data);

//   } catch (err) {
//     res.status(500).json({
//       error: err.response?.data || err.message
//     });
//   }
// });

// // Get stats for a specific queue
// async function getQueueStats(queueName, vhost = "/") {
//   try {
//     const url = `${RABBIT_HOST}/api/queues/${encodeURIComponent(vhost)}/${queueName}`;

//     const response = await axios.get(url, {
//       auth: {
//         username: USER,
//         password: PASS,
//       },
//     });

//     return response.data;

//   } catch (err) {
//     console.error("Error fetching queue stats:", err.response?.data || err.message);
//   }
// }

// (async () => {
//   const stats = await getQueueStats("my_queue");
//   console.log(stats);
// })();

module.exports = { getAllQueues };
