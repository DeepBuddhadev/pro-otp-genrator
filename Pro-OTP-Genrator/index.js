const crypto = require("crypto");

function secureRandomIndex(max) {
  const byte = crypto.randomBytes(1)[0];
  return byte % max;
}

function generateOTP(options = {}) {
  const {       // this all are default value
    length = 6,
    type = "numeric",
    expiresIn = 20, 
    humanFriendly = false,
  } = options;

  let charset = "";
  if (type === "numeric") charset = "0123456789";
  else if (type === "hex") charset = "abcdef0123456789";
  else if (type === "alphanumeric") {
    charset = humanFriendly
      ? "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
      : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  } else {
    throw new Error("Invalid OTP type");
  }

  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += charset[secureRandomIndex(charset.length)];
  }

  const session = {
    otp,
    expired: false,
  };

  if (expiresIn > 0) {
    setTimeout(() => {
      session.expired = true;
      console.log(`\nNow OTP ${session.otp} has expired!`);
      process.exit(1);
    }, expiresIn * 1000);
  }

  return session;
}

function verifyOTP(userOTP, session) {
  if (session.expired) {
    console.log(" OTP expired");
    process.exit(1);
  }

  if (userOTP !== session.otp) {
    console.log(" Incorrect OTP");
    process.exit(1);
  }

  session.expired = true;
  return { success: true, message: "OTP verified" };
}

module.exports = { generateOTP, verifyOTP };
