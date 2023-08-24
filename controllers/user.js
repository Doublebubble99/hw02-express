const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const { HttpError } = require("../helpers");
const User = require("../models/user");
const { SECRET_KEY } = process.env;
const userSchema = Joi.object({
  email: Joi.string()
    .required()
    .messages({ "any.required": "missing required email field" }),
  password: Joi.string()
    .required()
    .messages({ "any.required": "missing required password field" }),
});
const register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const hash = await bcrypt.hash(password, 10);
    const url = gravatar.url(email);
    const newUser = await User.create({
      ...req.body,
      password: hash,
      avatarUrl: url,
    });
    const { subscription } = newUser;
    res.status(201).json({ user: { email: newUser.email, subscription } });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY);
    await User.findByIdAndUpdate(user._id, { token });
    const { subscription } = user;
    res.status(200).json({ token, user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  const { _id } = req.user;
  try {
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
const current = async (req, res, next) => {
  const { email, subscription } = req.user;
  try {
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};
const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: temporaryDir, originalname } = req.file;
  try {
    const fileName = `${_id}_${originalname}`;
    const resultDir = path.join(avatarsDir, fileName);
    const image = await Jimp.read(temporaryDir);
    await image.resize(250, 250);
    await fs.rename(temporaryDir, resultDir);
    await image.write(resultDir);

    const avatarUrl = path.join("avatars", fileName);

    await User.findByIdAndUpdate(_id, {
      avatarUrl,
    });

    res.status(200).json({ avatarUrl });
  } catch (error) {
    await fs.unlink(temporaryDir);
    next(error);
  }
};
module.exports = {
  register,
  login,
  logout,
  current,
  updateAvatar,
};
