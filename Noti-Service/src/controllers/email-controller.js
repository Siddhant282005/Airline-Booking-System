const {EmailService} =require('../services');

async function create(req,res){
    try{
        const response = await EmailService.createTicket({
            subject: req.body.subject,
            content: req.body.content,
            recepientEmail: req.body.recepientEmail
        });
        return res.status(201).json({
            data: response,
            message: "Ticket created successfully",
            success: true
        });
    }catch(error){
        return res.status(500).json({
            message: "Error creating ticket",
            success: false
        });
    }
}

module.exports = {
    create
}