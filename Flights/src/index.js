const express=require('express');

const {ServerConfig ,Logger}=require('./config');
const apiRoutes=require('./routes');


const app=express();

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    // Allow auth header used by the frontend for CORS preflight.
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token'
    );
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api',apiRoutes);
app.use('/flightsService/api',apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`Successfully started the server on PORT: ${ServerConfig.PORT}`);
})