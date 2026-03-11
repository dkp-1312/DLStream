import express from 'express';
import nodemailer from "nodemailer";
import cors from "cors";
const routerF = express.Router();

routerF.use(cors());
routerF.use(express.json({limit:"25mb"}));
routerF.use(express.urlencoded({extended:true}));
routerF.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

const myemail='learnbvm@gmail.com';
const mypassword='mbqgegkzzdmfaznt';
function sendEmail(recipient_email,OTP)
{
    return new Promise((resolve,reject)=>{
        var transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:myemail,
                pass:mypassword 
            }
        });
        const mail_configs ={
            from:myemail,
            to:recipient_email,
            subject:'DL Stream Password Vefication',
            html:`<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>DL Stream - OTP Email Template</title>
  

</head>
<body>
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">DL Stream</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing DL Stream. Use the following OTP to complete your Email Verification Procedure. OTP is valid for 5 minutes.</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />DL Stream</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>DL Stream</p>
      <p>Vallabh Vidhyanagar,Anand</p>
      <p>Gujarat,India</p>
    </div>
  </div>
</div>
  
</body>
</html>`
        };
        transporter.sendMail(mail_configs,function(error,info){
            if(error){
                console.log(error,info);
                return reject({message:"An Error has occured"})
            }
            return resolve({message:"Email for OTP sent successfully"})
        });
    });
}

//For Postman testing
//here request would post ,it contain 2 body items one is recipient_email and another is OTP.
//Also the form of Body is in x-www-form-urlencoded
routerF.post('/send_otp', (req,res)=>{
    sendEmail(req.body.recipient_email,req.body.otp)
    .then((response)=>res.send(response.message))
    .catch((error)=>res.status(500).send(error.message))
});


export default routerF;