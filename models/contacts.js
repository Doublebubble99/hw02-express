const { Schema, model } = require("mongoose");
const { HandleMongooseError } = require("../middlewares");
const ContactsSchema = new Schema(
  {
    name: { type: String, requires: [true, "Set name for contact"] },
    email: { type: String },
    phone: { type: String },
    favorite: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);
ContactsSchema.post("save", HandleMongooseError);
const Contacts = model("contacts", ContactsSchema);
module.exports = Contacts;
