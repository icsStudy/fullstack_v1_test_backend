const bcrypt = require('bcrypt');
const User = require('../models/User');

const SALT_ROUNDS = 10;

const createUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });

  if (existing) {
    const err = new Error('כתובת האימייל כבר בשימוש');
    err.status = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });
};

const verifyCredentials = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    const err = new Error('אימייל או סיסמה שגויים');
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const err = new Error('אימייל או סיסמה שגויים');
    err.status = 401;
    throw err;
  }

  return { name: user.name, email: user.email };
};

module.exports = { createUser, verifyCredentials };
