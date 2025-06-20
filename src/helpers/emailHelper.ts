/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createTransport } from 'nodemailer';

const emailHelper = async (to, subject, text) => {
  // Create a transporter
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: 'gmicheloni52@gmail.com',
      pass: 'spoj oxgc vljd hnho',
    },
  });

  // Set up email options
  const mailOptions = {
    from: 'gmicheloni52@gmail.com',
    to: to,
    subject: subject,
    text: text,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default emailHelper;
