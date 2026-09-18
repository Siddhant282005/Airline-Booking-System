const amqplib = require('amqplib');

let channel, connection;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

async function connectQueue(retries = 0) {
    try {
        connection = await amqplib.connect('amqp://localhost:5672');
        channel = await connection.createChannel();
        await channel.assertQueue('noti-queue');
        console.log('✅ Booking Service connected to RabbitMQ');

        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err.message);
        });
        connection.on('close', () => {
            console.warn('RabbitMQ connection closed, retrying...');
            setTimeout(() => connectQueue(), RETRY_DELAY_MS);
        });
    } catch (error) {
        if (retries < MAX_RETRIES) {
            console.warn(`RabbitMQ connection failed. Retrying (${retries + 1}/${MAX_RETRIES}) in ${RETRY_DELAY_MS / 1000}s...`);
            await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
            return connectQueue(retries + 1);
        } else {
            console.error('Could not connect to RabbitMQ after max retries:', error.message);
        }
    }
}

async function sendData(data) {
    try {
        if (!channel) throw new Error('RabbitMQ channel not initialized');
        channel.sendToQueue('noti-queue', Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.error('Failed to send message to queue:', error.message);
        throw error;
    }
}

module.exports = { connectQueue, sendData };