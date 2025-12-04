/*  This is an AMQP publisher. It publishes static data to a AMQP server.
    Environment variables are read from the shell.
*/

//Library imports.
const AMQP = require('amqplib');
const config = require("./config");

class AmqpSubscriber {

  AMQP_URL;
  AMQP_LOG_URL; //For logging without exposing the password.
  AMQP_HOST;
  AMQP_CONNECTION; 
  AMQP_CHANNEL;
  AMQP_QUEUE_NAME;
  AMQP_STATUS_OK = false;

  constructor(host, port, userName, password, queueName){
    this.AMQP_HOST = host;
    this.AMQP_PORT = port;
    this.AMQP_USERNAME = userName;
    this.AMQP_PASSWORD = password;
    this.AMQP_QUEUE_NAME = queueName;

    this.AMQP_URL = `amqp://${userName}:${password}@${host}:${port}`;
    this.AMQP_LOG_URL = `amqp://${userName}:****@${host}:${port}`
  }

  async createAmqpConnection(amqpUrl){
    try{
      console.info("Connecting to the AMPQ server ", this.AMQP_LOG_URL);
      this.AMQP_CONNECTION = await AMQP.connect(amqpUrl);
      console.info("Connected to the AMPQ server ", this.AMQP_LOG_URL);

    } catch (err) {
      console.error("Failed connecting to the AMQP server", this.AMQP_LOG_URL, err.message);
      //Retry after a wait interval.
      await new Promise(resolve => setTimeout(resolve, 2000));
      await this.createAmqpConnection(amqpUrl);
    }
  }

  async createAmqpChannel(amqpConnection){
    try{
      console.info("Creating an AMPQ channel......");
      this.AMQP_CHANNEL = await amqpConnection.createChannel();
      console.info("Successfully created an AMPQ channel");
      
    } catch (err) {
      console.error("Failed creating an AMPQ channel! ", err.message);
      //Retry after a wait interval.
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.createAmqpChannel(amqpConnection);
    }
  }

  async createAmqpQueue(amqpChannel, queueName){
    try{
      console.info("Creating the AMPQ queue ", queueName);
      /*
      Durable: Queue survives a broker or connection restart but messages are lost. Queue is written to disk (without messages).
      Persistent: Messages in a queue survives a broker restart. Messages are written to disk. Needs a durable queue.
      Exclusive: Accessible only by the connection which created the queue. If that connection fails, the queue is destroyed.
      Auto delete: Delete the queue if the last subscriber disconnects.

      Duplicate creation does not create an exception if all properties are the same.
      */
      await amqpChannel.assertQueue(queueName, { durable: true, persistent: false, exclusive: false, autoDelete: false });
      console.info("Succesfully created the AMPQ queue", queueName);

    } catch (err) {
      console.error("Failed to create the AMPQ queue", queueName, err.message);
      //Retry after a wait interval.
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.createAmqpQueue(amqpChannel, queueName);
    }
  }

  //Set a flag if the AMQP setup is successful.
  async amqpStatus() {
    this.AMQP_STATUS_OK = true
  }

  async amqpSetup() {
    await this.createAmqpConnection(this.AMQP_URL);
    await this.createAmqpChannel(this.AMQP_CONNECTION);
    await this.createAmqpQueue(this.AMQP_CHANNEL, this.AMQP_QUEUE_NAME);
    //Wait for all phases to be successful to set the status flag.
    await this.amqpStatus();
  }

  //Function which subscribes to the AMPQ server.
  async subscribeAmqp() {
    if (!this.AMQP_STATUS_OK) {
      await this.amqpSetup();
    }

    console.info("Listening to queue ", this.AMQP_QUEUE_NAME, " for messages......");

      try{
          //Skip execution if the connection is being self-healed.
          this.AMQP_CHANNEL.consume(this.AMQP_QUEUE_NAME, (msg) => {
                  console.info("Consumption started......");
                  //If there is a message in the queue.
                  if (msg !== null) {
                    console.log("[x] Received AMQP message: ", msg.content.toString());
                    // Acknowledge message
                    this.AMQP_CHANNEL.ack(msg);
                  }
              }, { noAck: false }
          );

      } catch (err) {
          console.error("Failed subscribing to queue! ", err.message);
          console.info("Closing stale connections......");

          //Set the success flag as unsuccessful.
          this.AMQP_STATUS_OK = false;

          //Cleanup failed connections.
          if (this.AMQP_CHANNEL) await this.AMQP_CHANNEL.close();
          if (this.AMQP_CONNECTION) await this.AMQP_CONNECTION.close();
          console.log('Successfully closed stale connections. Retrying to subscribe......');
          this.subscribeAmqp();
      }
  }
}

module.exports = AmqpSubscriber;