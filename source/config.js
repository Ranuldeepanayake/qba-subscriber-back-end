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
    static AMQP_PORT;
    static AMQP_USERNAME;
    static AMQP_PASSWORD;
    static AMQP_DEFAULT_QUEUE_NAME;
    static AMQP_DEFAULT_VHOST;

    //Read environment variables from the runtime environment.
    static readEnv(){
        try{
            console.info("Reading environment variables from the runtime environment...... ");

            this.AMQP_PROVIDER = process.env.AMQP_PROVIDER || 'RabbitMQ';
            this.AMQP_HOST = process.env.AMQP_HOST_HOST || '192.168.56.128';
            this.AMQP_PORT = process.env.AMQP_PORT_PORT || '15672';
            this.AMQP_USERNAME = process.env.AMQP_USERNAME || 'ranul';
            this.AMQP_PASSWORD = process.env.AMQP_PASSWORD || 'ranul@123';
            this.AMQP_DEFAULT_QUEUE_NAME = process.env.AMQP_DEFAULT_QUEUE_NAME || 'QBA_QUEUE_1';
            this.AMQP_DEFAULT_VHOST = process.env.AMQP_DEFAULT_VHOST || '/';

        } catch (err) {
            console.error("Failed to read environment variables from the runtime environment! ", err);
        }
    }

    //Dump environment variables for checking.
    static printEnvs() {
        console.info("Printing environment variables......");

        console.log("ENV: ", this.AMQP_PROVIDER);
        console.log("ENV: ", this.AMQP_HOST);
        console.log("ENV: ", this.AMQP_PORT);
        console.log("ENV: ", this.AMQP_USERNAME);
        console.log("ENV: ", this.AMQP_DEFAULT_QUEUE_NAME);
        console.log("ENV: ", this.AMQP_DEFAULT_VHOST);
    }
}

module.exports = Config
