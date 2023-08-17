const router = require("express").Router();

// import controllers
const {syncContacts, getCommonUsers, getContactByID} = require("../controllers/rootController");

// API 1: Sync Contacts
router.post("/sync-contacts", syncContacts);

// API 2: Find common user for a particular number
router.get("/common-users", getCommonUsers);

// API 3: Get contacts by user_id with pagination and search
router.get("/get-contacts", getContactByID);

module.exports = router;
