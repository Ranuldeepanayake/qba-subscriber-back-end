/*  This is an AMQP publisher. It publishes static data to a AMQP server.
    Environment variables are read from the shell.
*/

//Library imports.
const AMQP = require('amqplib');
const config = require("./config");

class AmqpSubscriber {

  AMQP_URL = `amqp://${config.AMQP_USERNAME}:${config.AMQP_PASSWORD}@${config.AMQP_HOST}:${config.AMQP_MESSAGE_PORT}`;
  AMQP_CONNECTION; 
  AMQP_CHANNEL;
  AMQP_QUEUE;
  AMQP_STATUS_OK = false;

  AmqpSubscriber(){

  }

  async createAmqpConnection(amqpUrl){
    try{
      console.info("Attempting to connect to the AMPQ server ", this.AMQP_URL);
      this.AMQP_CONNECTION = await AMQP.connect(amqpUrl);
      console.info("Connected to the AMPQ server ", this.AMQP_URL);
    } catch (err) {
      console.error("Could not connect to the AMQP server! ", err.message);
      //Retry after a wait interval.
      await new Promise(resolve => setTimeout(resolve, 2000));
      await this.createAmqpConnection(amqpUrl);
    }
  }

  async createAmqpChannel(amqpConnection){
    try{
      console.info("Attempting to create an AMPQ channel...");
      this.AMQP_CHANNEL = await amqpConnection.createChannel();
      console.info("Created an AMPQ channel......");
    } catch (err) {
      console.error("Could not create an AMPQ channel! ", err.message);
      //Retry after a wait interval.
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.createAmqpChannel(amqpConnection);
    }
  }

  async createAmqpQueue(amqpChannel, queueName){
    try{
      console.info("Attempting to create an AMPQ queue......");
      /*
      Durable: Queue survives a broker or connection restart but messages are lost. Queue is written to disk (without messages).
      Persistent: Messages in a queue survives a broker restart. Messages are written to disk. Needs a durable queue.
      Exclusive: Accessible only by the connection which created the queue. If that connection fails, the queue is destroyed.
      Auto delete: Delete the queue if the last subscriber disconnects.

      Duplicate creation does not create an exception if all properties are the same.
      */
      await amqpChannel.assertQueue(queueName, { durable: true, persistent: false, exclusive: false, autoDelete: false });
      console.info("Created an AMPQ queue......");
    } catch (err) {
      console.error("Could not create an AMPQ queue! ", err.message);
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
    //*******Add another function to clean up failed connections.
    await this.createAmqpConnection(this.AMQP_URL);
    await this.createAmqpChannel(this.AMQP_CONNECTION);
    await this.createAmqpQueue(this.AMQP_CHANNEL, config.AMQP_DEFAULT_QUEUE_NAME);
    //Wait for all phases to be successful to set the status flag.
    await this.amqpStatus();
    await this.subscribeAmqp();
  }

  //Function which subscribes to the AMPQ server.
  async subscribeAmqp() {
    if (!this.AMQP_STATUS_OK) {
      this.amqpSetup();
    }

    console.info("Listening to queue ", config.AMQP_DEFAULT_QUEUE_NAME, " for messages......");

      try{
          //Skip execution if the connection is being self-healed.
          this.AMQP_CHANNEL.consume(config.AMQP_DEFAULT_QUEUE_NAME, (msg) => {
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
          console.error("Error in subscribing to queue! ", err.message);

          if (this.AMQP_CHANNEL) await this.AMQP_CHANNEL.close();
          if (this.AMQP_CONNECTION) await this.AMQP_CONNECTION.close();
          console.log('AMQP resources released. Retrying to subscribe......');
          await this.amqpSetup();
      }
    //   } finally {
          
    // }
  }
}

module.exports = AmqpSubscriber;