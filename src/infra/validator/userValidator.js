import Joi from "joi";
import bcrypt from "bcryptjs";

export const userValidation = (req, res, next) => {
  const Schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required()
  });

  const { error } = Schema.validate(req.body);

  if (error) {
    res.status(400).json({
      error: error.details[0].message
    });
  }

  next();
}