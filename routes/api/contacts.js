const express = require("express");
const controllers = require("../../controllers/contacts");
const router = express.Router();
router.get("/", controllers.getContacts);

router.get("/:contactId", controllers.getContactById);

router.post("/", controllers.addContact);

router.delete("/:contactId", controllers.deleteContact);

router.put("/:contactId", controllers.updateContactById);

module.exports = router;
