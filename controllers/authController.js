const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, message: 'כל השדות נדרשים' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: 'הסיסמה חייבת להכיל לפחות 6 תווים' });
    }

    await authService.createUser({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    res.status(201).json({ success: true, message: 'נרשמת בהצלחה' });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ success: false, message: 'אימייל וסיסמה נדרשים' });
    }

    const user = await authService.verifyCredentials({
      email: email.trim(),
      password,
    });

    res.json({ success: true, message: 'התחברת בהצלחה', user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
