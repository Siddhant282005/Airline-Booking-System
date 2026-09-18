const amqplib = require('amqplib');

let channel, connection;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

async function connectQueue(retries = 0) {
    try {
        connection = await amqplib.connect('amqp://localhost:5672');
        channel = await connection.createChannel();
        await channel.assertQueue('noti-queue', { durable: true });
        console.log('✅ Noti-Service connected to RabbitMQ');

        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err.message);
        });
        connection.on('close', () => {
            console.warn('Noti-Service: RabbitMQ connection closed, retrying...');
            setTimeout(() => connectQueue(), RETRY_DELAY_MS);
        });

        consumeMessages();
    } catch (error) {
        if (retries < MAX_RETRIES) {
            console.warn(`Noti-Service: RabbitMQ connection failed. Retrying (${retries + 1}/${MAX_RETRIES}) in ${RETRY_DELAY_MS / 1000}s...`);
            await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
            return connectQueue(retries + 1);
        } else {
            console.error('Noti-Service: Could not connect to RabbitMQ after max retries:', error.message);
        }
    }
}

function consumeMessages() {
    channel.consume('noti-queue', async (data) => {
        if (!data) return;
        try {
            const message = JSON.parse(data.content.toString());
            console.log('📬 Received notification message for booking:', message.bookingId);

            const mailer = require('./email-config');
            await mailer.sendMail({
                from: process.env.GMAIL_EMAIL || 'airlinenoti228@gmail.com',
                to: message.recipientEmail,
                subject: 'Smart Sky — Booking Confirmation ✈️',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #0a0f1e 0%, #1a2744 100%); padding: 30px; text-align: center;">
                            <h1 style="color: #f59e0b; margin: 0;">✈️ Smart Sky</h1>
                        </div>
                        <div style="padding: 30px; background: #f8fafc;">
                            <h2 style="color: #1e293b;">Booking Confirmed! 🎉</h2>
                            <p style="color: #475569; font-size: 16px;">${message.message}</p>
                            <div style="background: #e0f2fe; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #0369a1;"><strong>Booking ID:</strong> #${message.bookingId}</p>
                            </div>
                            <p style="color: #64748b; font-size: 14px;">Thank you for choosing Smart Sky. Have a great flight!</p>
                        </div>
                        <div style="background: #1e293b; padding: 20px; text-align: center;">
                            <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2024 Smart Sky Airlines. All rights reserved.</p>
                        </div>
                    </div>
                `
            });

            console.log(`✅ Email sent successfully for booking ${message.bookingId}`);
            channel.ack(data);
        } catch (emailError) {
            console.error('❌ Failed to send email:', emailError.message);
            // nack without requeue to avoid infinite loop — log for manual review
            channel.nack(data, false, false);
        }
    });
}

module.exports = { connectQueue };
