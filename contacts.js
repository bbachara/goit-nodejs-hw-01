const fs = require("fs").promises;
const path = require("path");

// Create contactsPath variable
const contactsPath = path.join(__dirname, "contacts.json");

// Function to read contacts from the file
async function readContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading contacts:", error);
    return [];
  }
}

// Function to write contacts to the file
async function writeContacts(contacts) {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    console.error("Error writing contacts:", error);
  }
}

// Existing functions
async function listContacts() {
  return await readContacts();
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  return contacts.find((contact) => contact.id === contactId);
}

async function removeContact(contactId) {
  let contacts = await readContacts();
  contacts = contacts.filter((contact) => contact.id !== contactId);
  await writeContacts(contacts);
}

async function addContact(newContact) {
  const contacts = await readContacts();
  contacts.push(newContact);
  await writeContacts(contacts);
}

// Export functions via module.exports
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
