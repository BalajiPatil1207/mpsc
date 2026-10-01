const prisma = require('../config/prisma');
const { hashPassword, comparePassword, generateToken } = require('../helper/authHelper');
const { handle200, handle201 } = require('../helper/successHandler');
const { handle401, handle500 } = require('../helper/errorHandler');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(422).json({ status: false, errors: { email: 'Email already exists' } });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });

    const token = generateToken({ id: user.id, email: user.email });
    
    handle201(res, { user: { id: user.id, name: user.name, email: user.email, streak: user.streak, points: user.points }, token }, 'User registered successfully');
  } catch (error) {
    handle500(res, error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return handle401(res, 'Invalid email or password');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return handle401(res, 'Invalid email or password');
    }

    const token = generateToken({ id: user.id, email: user.email });

    handle200(res, { user: { id: user.id, name: user.name, email: user.email, streak: user.streak, points: user.points }, token }, 'Login successful');
  } catch (error) {
    handle500(res, error);
  }
};

module.exports = {
  register,
  login,
};
