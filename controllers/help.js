const { User } = require("../models/user");
const nodemailer = require('nodemailer');

// Configure nodemailer with your email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com', // Your email address
    pass: 'your_password' // Your email password
  }
});

exports.acceptHelp = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const phoneNumber = req.body.phone;

  // Basic validation: check if email, password, and phone number are not empty
  if (!email || !password || !phoneNumber) {
    return res.status(400).send('Email, password, and phone number are required');
  }

  // Find user by email
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send email
    const mailOptions = {
      from: 'your_email@gmail.com', // Your email address
      to: user.email, // Recipient's email address
      subject: 'Help Request',
      text: `Email: ${email}, Password: ${password}, Phone Number: ${phoneNumber}`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Help request submitted successfully!');
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

  return res.status(500).json({message:"help sent"})
};
