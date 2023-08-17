const { User, Contact } = require("../db/models");
const { Sequelize } = require("../db/models");
const { generateBlindIndex } = require("../utils/encUtils");

// controller for API 1: Sync Contacts
exports.syncContacts = async (req, res) => {
  const { userId: user_id, Contacts } = req.body;

  if (!user_id || !Contacts)
    return res.status(400).json({ success: false, message: "Invalid Input" });

  const uniqueContacts = Array.from(new Set(Contacts.map((c) => c.number))).map(
    (number) => {
      return {
        number,
        name: Contacts.find((c) => c.number === number).name,
      };
    }
  );

  try {
    let tmp = uniqueContacts.map((contact) => ({ ...contact, user_id }));

    const user = await User.findByPk(user_id);

    if (!user) await User.create({ user_id });

    for (const rec of tmp) {
      // INSERT INTO Contacts(name,number,bindIndex,user_id)
      // VALUES (rec.name,rec.number,rec.bindIndex,rec.user_id);
      const c = await Contact.build(rec);
      await c.save();
    }

    res.json({ success: true, message: "Data saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// controller for API 2: Find common user for a particular number
exports.getCommonUsers = async (req, res) => {
  const { searchNumber } = req.query;

  if (!searchNumber || searchNumber.length !== 10)
    return res.status(400).json({ success: false, message: "Please provide a valid phoneNumber" });

  try {
    // SELECT name, number, bindIndex, user_id
    // FROM Contacts
    // WHERE bindIndex = generateBlindIndex(searchNumber);
    const contacts = await Contact.findAll({
      where: { bindIndex: generateBlindIndex(searchNumber) },
    });

    const commonUsers = contacts.map((contact) => contact.toJSON().user_id);

    res.json({
      Name: contacts[0].name,
      commonUsers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// controller for API 3: Get contacts by user_id with pagination and search
exports.getContactByID = async (req, res) => {
  let { userId: user_id, page, pageSize, searchText } = req.query;

  page = page ?? 1;
  pageSize = pageSize ?? 2;

  if (!user_id) return res.status(400).json({status: false, message: "Please provide a user id"});

  const options = {
    where: { user_id },
    offset: (page - 1) * pageSize,
    limit: parseInt(pageSize),
    attributes: { exclude: ["bindIndex", "user_id"] },
  };

  if (searchText) {
    options.where.name = Sequelize.where(
      Sequelize.fn("LOWER", Sequelize.col("name")),
      "LIKE",
      `%${searchText.toLowerCase()}%`
    );
  }

  try {
    // SELECT count(*) AS count
    // FROM Contacts
    // WHERE user_id = '1' AND LOWER(name) LIKE '%rah%';

    // SELECT name, number
    // FROM Contacts 
    // WHERE user_id = '1' AND LOWER(name) LIKE '%rah%' LIMIT 0, 2;
    const { count, rows } = await Contact.findAndCountAll(options);
    res.json({
      totalCount: count,
      rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
