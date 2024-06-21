// Assuming your asyncErrorHandler is defined in '../middlewares/asyncErrorHandler'
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Define the function to send emails
const sendEmail = asyncErrorHandler(async (req, res) => {
    
  try {
    const recipients = ['youneshero436@gmail.com'];
    const subject = 'Sending with SendGrid is Fun';
    const htmlContent = '<strong>and easy to do anywhere, even with Node.js</strong>';

    const msg = {
      to: recipients,
      from: process.env.SENDGRID_MAIL,
      subject: subject,
      html: htmlContent,
    };

    const response = await sgMail.send(msg);

    // Log the SendGrid API response
    console.log('SendGrid API Response:', response);

    // Optionally, you can return a success message or handle other logic
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    // Log and handle errors
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send email', error });
  }
});

// Export the function for use in other fi
sendEmail() 
