const express=require('express');

const {ServerConfig ,Logger, Queue}=require('./config');
const apiRoutes=require('./routes');
const mailsender = require('./config/email-config');

const app=express();

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api',apiRoutes);
app.listen(ServerConfig.PORT,async() => {
    console.log(`Successfully started the server on PORT: ${ServerConfig.PORT}`);
    // Startup configuration check
    if (!process.env.GMAIL_PASS || process.env.GMAIL_PASS === 'CHANGE_ME_WITH_APP_PASSWORD') {
        console.warn('⚠️  WARNING: GMAIL_PASS is not configured in .env!');
        console.warn('   Email notifications will fail until you set a valid Gmail App Password.');
        console.warn('   Get one at: https://myaccount.google.com/apppasswords');
    }
    // Connect to RabbitMQ and start consuming messages
    await Queue.connectQueue();
});