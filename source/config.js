//Library imports.
require('dotenv').config();

/*
When functions are defined as static, they cannot be instantiated as below.
// const a = new config();
// const b = new config();
// a.readEnv();
// a.printEnvs();
*/

class Config {

    static AMQP_PROVIDER;
    static AMQP_HOST;
    static AMQP_API_PORT;
    static AMQP_MESSAGE_PORT;
    static AMQP_USERNAME;
    static AMQP_PASSWORD;
    static AMQP_DEFAULT_QUEUE_NAME;
    static AMQP_DEFAULT_VHOST;
    static AMQP_RETRY_INTERVAL;
    static WEB_SERVER_PORT;

    //Read environment variables from the runtime environment.
    static readEnv(){
        try{
            console.info("Reading environment variables from the runtime environment...... ");

            this.AMQP_PROVIDER = process.env.AMQP_PROVIDER || 'RabbitMQ';
            this.AMQP_HOST = process.env.AMQP_HOST_HOST || '192.168.56.128';
            this.AMQP_API_PORT = process.env.AMQP_API_PORT || '15672';
            this.AMQP_MESSAGE_PORT = process.env.AMQP_MESSAGE_PORT || '5672';
            this.AMQP_USERNAME = process.env.AMQP_USERNAME || 'ranul';
            this.AMQP_PASSWORD = process.env.AMQP_PASSWORD || 'ranul@123';
            this.AMQP_DEFAULT_QUEUE_NAME = process.env.AMQP_DEFAULT_QUEUE_NAME || 'QBA_QUEUE_1';
            this.AMQP_DEFAULT_VHOST = process.env.AMQP_DEFAULT_VHOST || '/';
            this.AMQP_RETRY_INTERVAL = process.env.AMQP_RETRY_INTERVAL || '2000';
            this.WEB_SERVER_PORT = process.env.WEB_SERVER_PORT || '31000';

            console.info("Successfully read environment variables from the runtime environment");
            
        } catch (err) {
            console.error("Failed to read environment variables from the runtime environment! ", err);
        }
    }

    //Dump environment variables for checking.
    static printEnvs() {
        console.info("Printing environment variables......");

        console.log("AMQP_PROVIDER=", this.AMQP_PROVIDER);
        console.log("AMQP_HOST=", this.AMQP_HOST);
        console.log("AMQP_API_PORT=", this.AMQP_API_PORT);
        console.log("AMQP_MESSAGE_PORT=", this.AMQP_MESSAGE_PORT);
        console.log("AMQP_USERNAME=", this.AMQP_USERNAME);
        console.log("AMQP_PASSWORD=", "****PASSWORD HIDDEN****");
        console.log("AMQP_DEFAULT_QUEUE_NAME=", this.AMQP_DEFAULT_QUEUE_NAME);
        console.log("AMQP_DEFAULT_VHOST=", this.AMQP_DEFAULT_VHOST);
        console.log("AMQP_RETRY_INTERVAL=", this.AMQP_RETRY_INTERVAL);
        console.log("WEB_SERVER_PORT=", this.WEB_SERVER_PORT);

        console.info("Successfully printed environment variables");
    }

    //Dump environment variables for checking.
    static logInitStart() {
        console.log("*********************************************************************************");
        console.log("**                              Initializating                                 **");
        console.log("*********************************************************************************");
    }

    //Dump environment variables for checking.
    static logInitEnd() {
        console.log("*********************************************************************************");
        console.log("**                          Initialization complete                            **");
        console.log("*********************************************************************************");
    }
}

module.exports = Config
