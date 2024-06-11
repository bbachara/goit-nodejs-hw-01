const { Command } = require("commander");
const fs = require("fs").promises;
const path = require("path");

const program = new Command();
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function readContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading contacts:", error);
    return [];
  }
}

async function writeContacts(contacts) {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    console.error("Error writing contacts:", error);
  }
}

async function invokeAction({ action, id, name, email, phone }) {
  const contacts = await readContacts();

  switch (action) {
    case "list":
      console.log("All contacts:");
      console.log(contacts);
      break;

    case "get":
      const contactById = contacts.find((contact) => contact.id === id);
      console.log("Contact by ID:");
      console.log(contactById);
      break;

    case "add":
      const newContact = { id, name, email, phone };
      contacts.push(newContact);
      await writeContacts(contacts);
      console.log("Added new contact:");
      console.log(newContact);
      break;

    case "remove":
      const indexToRemove = contacts.findIndex((contact) => contact.id === id);
      if (indexToRemove !== -1) {
        const removedContact = contacts.splice(indexToRemove, 1)[0];
        await writeContacts(contacts);
        console.log("Removed contact:");
        console.log(removedContact);
      } else {
        console.log("Contact not found");
      }
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);
