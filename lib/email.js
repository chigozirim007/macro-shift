import nodemailer from 'nodemailer';
import { getEmailEnv } from './env';

const APP_NAME = 'Macro-Shift';

function createTransporter() {
  const { user, appPassword } = getEmailEnv();

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass: appPassword,
    },
  });
}

function senderAddress() {
  return `"${APP_NAME}" <${getEmailEnv().user}>`;
}

export async function sendVerificationEmail(toEmail, code, firstName) {
  const mailOptions = {
    from: senderAddress(),
    to: toEmail,
    subject: `${APP_NAME} — Your Verification Code: ${code}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#000d14;font-family:sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000d14;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0" style="background-color:#0a111a;border:1px solid rgba(255,255,255,0.08);border-radius:24px;overflow:hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="padding:40px 40px 32px;border-bottom:1px solid rgba(255,255,255,0.05);">
                      <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.4em;text-transform:uppercase;color:#06b6d4;">Strategic Intelligence Platform</p>
                      <h1 style="margin:8px 0 0;font-size:28px;font-weight:900;text-transform:uppercase;font-style:italic;color:#ffffff;letter-spacing:-0.03em;">MACRO-SHIFT</h1>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <p style="margin:0 0 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.3em;color:#64748b;">Access Verification</p>
                      <h2 style="margin:0 0 24px;font-size:20px;font-weight:900;text-transform:uppercase;font-style:italic;color:#ffffff;">
                        Hello, ${firstName || 'Analyst'}
                      </h2>
                      <p style="margin:0 0 32px;font-size:13px;color:#94a3b8;line-height:1.6;">
                        Your terminal access request has been received. Use the code below to verify your email address and activate your intelligence feed.
                      </p>

                      <!-- OTP Box -->
                      <div style="background-color:#0f1c29;border:1px solid rgba(6,182,212,0.3);border-radius:16px;padding:32px;text-align:center;margin-bottom:32px;">
                        <p style="margin:0 0 12px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:0.5em;color:#06b6d4;">Verification Code</p>
                        <p style="margin:0;font-size:48px;font-weight:900;letter-spacing:0.3em;color:#ffffff;font-style:italic;">${code}</p>
                      </div>

                      <div style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:16px;">
                        <p style="margin:0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#64748b;">
                          ⚠ This code expires in <span style="color:#f59e0b;">15 minutes</span>. Do not share it with anyone.
                        </p>
                      </div>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.05);">
                      <p style="margin:0;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#334155;">
                        If you did not request this, you can safely ignore this email. © ${new Date().getFullYear()} ${APP_NAME}.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  try {
    await createTransporter().sendMail(mailOptions);
  } catch (error) {
    console.error('Gmail SMTP error:', error);
    throw new Error('Failed to send verification email. Check GMAIL_USER and GMAIL_APP_PASSWORD.');
  }
}

export async function sendContactEmail(name, email, subject, message) {
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: 'macroshift.noreply@gmail.com', // Official platform email
    replyTo: email,
    subject: `MacroShift Contact: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="margin:0;padding:0;background-color:#000d14;font-family:sans-serif;color:#ffffff;">
          <div style="padding:40px;">
            <h2 style="color:#06b6d4;font-style:italic;">New Contact Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border-color:rgba(255,255,255,0.1); margin: 20px 0;" />
            <p style="white-space:pre-wrap;line-height:1.6;">${message}</p>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await createTransporter().sendMail(mailOptions);
  } catch (error) {
    console.error('Contact email error:', error);
    throw new Error('Failed to dispatch message to terminal support.');
  }
}

export async function sendPasswordResetEmail(toEmail, code, firstName) {
  const mailOptions = {
    from: senderAddress(),
    to: toEmail,
    subject: `${APP_NAME} — Password Reset Code: ${code}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#000d14;font-family:sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000d14;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0" style="background-color:#0a111a;border:1px solid rgba(255,255,255,0.08);border-radius:24px;overflow:hidden;">
                  <tr>
                    <td style="padding:40px 40px 32px;border-bottom:1px solid rgba(255,255,255,0.05);">
                      <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.4em;text-transform:uppercase;color:#06b6d4;">Strategic Intelligence Platform</p>
                      <h1 style="margin:8px 0 0;font-size:28px;font-weight:900;text-transform:uppercase;font-style:italic;color:#ffffff;letter-spacing:-0.03em;">MACRO-SHIFT</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <p style="margin:0 0 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.3em;color:#64748b;">Password Recovery Protocol</p>
                      <h2 style="margin:0 0 24px;font-size:20px;font-weight:900;text-transform:uppercase;font-style:italic;color:#ffffff;">
                        Hello, ${firstName || 'Analyst'}
                      </h2>
                      <p style="margin:0 0 32px;font-size:13px;color:#94a3b8;line-height:1.6;">
                        A password reset was requested for your MacroShift terminal account. Use the code below to verify your identity and set a new password.
                      </p>

                      <div style="background-color:#0f1c29;border:1px solid rgba(6,182,212,0.3);border-radius:16px;padding:32px;text-align:center;margin-bottom:32px;">
                        <p style="margin:0 0 12px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:0.5em;color:#06b6d4;">Reset Code</p>
                        <p style="margin:0;font-size:48px;font-weight:900;letter-spacing:0.3em;color:#ffffff;font-style:italic;">${code}</p>
                      </div>

                      <div style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:16px;">
                        <p style="margin:0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#64748b;">
                          ⚠ This code expires in <span style="color:#f59e0b;">15 minutes</span>. If you did not request this, please secure your account.
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.05);">
                      <p style="margin:0;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#334155;">
                        © ${new Date().getFullYear()} ${APP_NAME}.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  try {
    await createTransporter().sendMail(mailOptions);
  } catch (error) {
    console.error('Password reset email error:', error);
    throw new Error('Failed to dispatch password reset code.');
  }
}
