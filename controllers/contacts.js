const Joi = require("joi");
const Contacts = require("../models/contacts");
const { HttpError } = require("../helpers");
const schema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "missing required name field" }),
  email: Joi.string()
    .required()
    .messages({ "any.required": "missing required email field" }),
  phone: Joi.string()
    .required()
    .messages({ "any.required": "missing required phone field" }),
  favorite: Joi.boolean(),
});
const favoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ "any.required": "missing field favorite" }),
});
const getContacts = async (req, res, next) => {
  try {
    const results = await Contacts.find({}, "-createdAt -updatedAt");
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};
const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const response = await Contacts.findById(
      contactId,
      "-createdAt -updatedAt"
    );
    if (!response) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
const addContact = async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await Contacts.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contacts.findByIdAndDelete(contactId);
    if (result) {
      return res.status(200).json({
        message: "contact deleted",
      });
    }
    throw HttpError(404, "Not found");
  } catch (error) {
    next(error);
  }
};
const updateContactById = async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    const { name, email, phone } = req.body;
    if (!name && !email && !phone) {
      return res.status(400).json({ message: `missing fields` });
    } else if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contacts.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const updateStatusContact = async (req, res, next) => {
  const { error } = favoriteSchema.validate(req.body);
  try {
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contacts.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContactById,
  updateStatusContact,
};
