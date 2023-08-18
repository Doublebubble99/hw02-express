const express = require("express");
const controllers = require("../../controllers/contacts");
const { isValidId, checkTokenValidate } = require("../../middlewares");
const router = express.Router();
router.get("/", checkTokenValidate, controllers.getContacts);

router.get(
  "/:contactId",
  checkTokenValidate,
  isValidId,
  controllers.getContactById
);

router.post("/", checkTokenValidate, controllers.addContact);

router.delete(
  "/:contactId",
  checkTokenValidate,
  isValidId,
  controllers.deleteContact
);

router.put(
  "/:contactId",
  checkTokenValidate,
  isValidId,
  controllers.updateContactById
);

router.patch(
  "/:contactId/favorite",
  checkTokenValidate,
  isValidId,
  controllers.updateStatusContact
);

module.exports = router;
