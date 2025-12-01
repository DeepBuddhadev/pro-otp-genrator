const { generateOTP, verifyOTP } = require("./index");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const session = generateOTP({
  length: 6,         // length you want
  type: "numeric",         // numeric or hex or alphanumeric
  expiresIn: 10,         // OTP expire second
});

console.log("Generated OTP:", session.otp);

readline.question("Enter OTP: ", (input) => {
  const result = verifyOTP(input.trim(), session);
  console.log(result);

  console.log(verifyOTP(input.trim(), session)); // OTP expired

  readline.close();
});
