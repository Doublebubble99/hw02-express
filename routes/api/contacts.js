const express = require("express");
const controllers = require("../../controllers/contacts");
const { isValidId } = require("../../middlewares");
const router = express.Router();
router.get("/", controllers.getContacts);

router.get("/:contactId", isValidId, controllers.getContactById);

router.post("/", controllers.addContact);

router.delete("/:contactId", isValidId, controllers.deleteContact);

router.put("/:contactId", isValidId, controllers.updateContactById);

router.patch(
  "/:contactId/favorite",
  isValidId,
  controllers.updateStatusContact
);

module.exports = router;
