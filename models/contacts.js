const { Schema, model } = require("mongoose");
const { HandleMongooseError } = require("../helpers");
const ContactsSchema = new Schema(
  {
    name: { type: String, requires: [true, "Set name for contact"] },
    email: { type: String },
    phone: { type: String },
    favorite: { type: Boolean, default: false },
    owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { versionKey: false, timestamps: true }
);
ContactsSchema.post("save", HandleMongooseError);
const Contacts = model("contacts", ContactsSchema);
module.exports = Contacts;
