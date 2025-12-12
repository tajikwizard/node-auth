const bcrypt = require("bcryptjs");


const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // Generate salt
  const hashedPassword = await bcrypt.hash(password, salt); // Hash password
  return hashedPassword;
};


const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, verifyPassword };
