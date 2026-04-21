// server/lib/email.ts

const getSecret = (key: string, defaultValue: string = ''): string => {
  const value = process.env[key];
  return value ? value.trim() : defaultValue;
};

export async function sendOtpEmail(email: string, otp: string) {
  const BREVO_API_KEY = getSecret('BREVO_API_KEY');
  const SENDER_EMAIL = getSecret('BREVO_SENDER_EMAIL', 'info@indraprasthaonline.co.in');
  const SENDER_NAME = getSecret('BREVO_SENDER_NAME', 'Indraprastha Online');

  // Yeh URL aap apne hisab se change kar sakte hain
  const BASE_URL = 'https://ais-dev-loatzuep5rbi22z43jwltm-415967612205.asia-southeast1.run.app';
  const LOGO_URL = `${BASE_URL}/logo.png`;
  const MOONTECH_LOGO_URL = `${BASE_URL}/moontech-logo.png`;

  if (!BREVO_API_KEY) {
    console.warn('[EMAIL SERVICE] BREVO_API_KEY is missing! Check your .env file.');
    return false;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: email.toLowerCase() }],
        subject: `${otp} - इंद्रप्रस्थ ONLINE Verification Code`,
        htmlContent: `
          <div style="background-color: #000000; padding: 50px 20px; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 550px; margin: auto; background-color: #000000; padding: 20px;">
              
              <!-- LOGO SECTION -->
              <div style="margin-bottom: 20px;">
                <img src="${LOGO_URL}" alt="Logo" style="width: 100px; height: 100px; border-radius: 50%; border: 2px solid #FF9900;">
              </div>

              <!-- Header Branding -->
              <div style="margin-bottom: 40px;">
                <h1 style="margin: 0; color: #FF9900; font-style: italic; font-weight: 900; text-transform: uppercase; font-size: 32px; letter-spacing: -1px;">
                  इंद्रप्रस्थ <span style="color: #FFFF00;">ONLINE</span>
                </h1>
                <p style="margin: 5px 0 0; color: #FF0000; font-size: 10px; font-weight: 900; letter-spacing: 3px; font-style: italic; text-transform: uppercase;">
                  BHARAT KA LOCAL BAZAAR
                </p>
              </div>

              <!-- Main OTP Card -->
              <div style="background-color: #111111; border: 1px solid #222222; border-radius: 40px; padding: 60px 40px; margin-bottom: 40px;">
                
                <!-- VERIFICATION CODE in BLUE -->
                <p style="color: #3399FF; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">
                  VERIFICATION CODE
                </p>
                
                <!-- OTP Number in ORANGE -->
                <div style="font-size: 64px; font-weight: 900; color: #FF6600; letter-spacing: 12px; font-family: 'Courier New', Courier, monospace; margin: 20px 0;">
                  ${otp}
                </div>
                
                <!-- Expiry Text in BLUE -->
                <p style="color: #3399FF; font-size: 12px; font-weight: 600; margin-top: 40px;">
                  Ye code 10 minute ke liye valid hai.
                </p>
              </div>

              <!-- Footer Section -->
              <div style="border-top: 1px solid #222222; padding-top: 30px; margin-top: 20px;">
                <!-- Main Footer Line in BLUE -->
                <p style="color: #3399FF; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 25px;">
                  © 2026 INDRAPRASTHA ONLINE • INDIA'S HYPERLOCAL MARKETPLACE
                </p>

                <!-- Powered By Section -->
                <div style="display: inline-block; padding: 15px 25px; background: rgba(255,255,255,0.03); border-radius: 20px; border: 1px solid #222222;">
                  <p style="color: #666666; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Powered By</p>
                  <div style="display: table; margin: auto; text-align: center;">
                    <img src="${MOONTECH_LOGO_URL}" alt="MoonTech" style="height: 24px; vertical-align: middle; display: inline-block;">
                    <span style="color: #ffffff; font-size: 14px; font-weight: 900; font-style: italic; vertical-align: middle; padding-left: 10px; display: inline-block;">MoonTechKnowledge</span>
                  </div>
                </div>
              </div>

              <p style="color: #333333; font-size: 9px; margin-top: 30px;">
                Helping local businesses grow online in digital Bharat.
              </p>
            </div>
          </div>
        `
      })
    });
    return response.ok;
  } catch (error) {
    console.error('[EMAIL SERVICE] Failed to send email:', error);
    return false;
  }
}