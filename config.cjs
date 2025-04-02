const fs = require("fs");
require("dotenv").config();

const parseBoolean = (value, defaultValue) => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
};

const config = {
  // Session Configuration
  SESSION_ID: process.env.SESSION_ID || "CYBER-DEXTER-MD [KILL]>>>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0NvQWl0dzdtOGZuK0RGREtUblFHZmxMWmU2RjE3c0hhWVpiTEN4cTRVaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWndoazJGQWFTWXlrcXlheWNUek9jemlCMWZpZHJCU0JBb1ZTYit3SUFYVT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJjSUQ5emxOZmxQQzVUWk5wbGpleGZpYmpFRnd6NlJvUWw3UjZjbW95TVVvPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJhYXhNRnNQNVl6L1pVWnBlWUZaMUhnSW1JWEFpaWV1L3FrY1NpeG53TDNNPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InNFL084OWo0QTBYbXhLd2JSeDhRb25XclZBL01Ram9wNjJVWHlqS2FQbUU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjdES2N2d1p4N3lqT0t6aERNS1lQOENqRWlMQzNwQU9GVC8vbEplV2t1RGc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic0RaOTEvWmtOMjVjcHdWTUFWUkVGYkVuYmJaUlhmN3BOVmJ3aHBqUndFMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYTE2c1BTNUVrOHlVNUpWZUloUEI2VlU1SC9jcGZTdi94UEdJUzA1STloUT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im9iQjRKdTI4ejkxUUNIejFoT1drMzVUbzYzd3YxYVloSDNicGFWUEVWbTRNcWhMNU8xSzJJVWcrY2tOSVA0a01YYmpQMmY5Mzdwdzc0djEwOWlzemhBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTA1LCJhZHZTZWNyZXRLZXkiOiJvZVM3TElkS0FqYm1lUDgyQVFMS3ZHcmpNaHlVNUVKY05KZnZOU2FvcWFrPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6Ijk5NDQwOTE0NTkxM0BzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI0NjU4NTk0RkJBQTkxOEI2NjA4NDIxMTQ1RDFCQ0NDNSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzQzNTc5MjA2fSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5OTQ0MDkxNDU5MTNAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiN0NDNzg0QzNFRkQ5OUVBMDM2NzlFRDQ4RUM4ODY3ODMifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc0MzU3OTIwNn1dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sImRldmljZUlkIjoicGpZM2x4RHBRbUtmVXIySTFpeHhZUSIsInBob25lSWQiOiIyMGJhN2RlMS01NzEwLTRmYTAtYjYyMi00M2MzZmVlYzM0OTciLCJpZGVudGl0eUlkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWUdnZEhrZ0NEalpPV3NsTFFrbEZOUlA5ODRVPSJ9LCJyZWdpc3RlcmVkIjp0cnVlLCJiYWNrdXBUb2tlbiI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjRNYWdib1ZVNytZYVpmRVZ1a1J5dmRtWGJsbz0ifSwicmVnaXN0cmF0aW9uIjp7fSwicGFpcmluZ0NvZGUiOiJTVjhBNk5GUiIsIm1lIjp7ImlkIjoiOTk0NDA5MTQ1OTEzOjRAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiWm9tYmllIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNKdkN5NjRDRUxqUXM3OEdHQUlnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiIvbzI4ajBtWVRpRGFqYTg0Zmo3OXpxZGlWQnFYYkxmbnRiZDRQeVBjaTF3PSIsImFjY291bnRTaWduYXR1cmUiOiJIMTZFZjdaanJOYVczQ3ErQjRmV2xrWDRCdnhtRlFSSjVaSXkvMWZtb1R4RnR6VGdtUHlCTDVFT0g2SW05ZUh6MGVJdmUvSktaUjhnQmJ1U21mQ2tEQT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiK0M3UVhNRWJmTmZjd2pYWHZYT3p6OTUvQXNDajA2aTJycVNQNzhGQm5JdnNPK3dzYUx6NWppUUY0c1hBS2ZZN1orSFFXcklCOGI4Tml5SElhRDJ0Z2c9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiI5OTQ0MDkxNDU5MTM6NEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJmNk52STlKbUU0ZzJvMnZPSDQrL2M2bllsUWFsMnkzNTdXM2VEOGozSXRjIn19XSwicGxhdGZvcm0iOiJzbWJhIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzQzNTc5MjA1LCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUhXViJ9",
  PREFIX: process.env.PREFIX || ".",
  
  // Auto Features
  AUTO_STATUS_SEEN: parseBoolean(process.env.AUTO_STATUS_SEEN, true),
  AUTO_STATUS_REACT: parseBoolean(process.env.AUTO_STATUS_REACT, true),
  AUTO_STATUS_REPLY: parseBoolean(process.env.AUTO_STATUS_REPLY, false),
  AUTO_STATUS_REPLY_VOICE: parseBoolean(process.env.AUTO_STATUS_REPLY_VOICE, false),
  AUTO_STATUS_REPLY_VOICE_MULTI: parseBoolean(process.env.AUTO_STATUS_REPLY_VOICE_MULTI, false),
  STATUS_READ_MSG: process.env.STATUS_READ_MSG || "*📍 Auto Status Seen Bot By CYBER-DEXTER-MD*",

  AUTO_DL: parseBoolean(process.env.AUTO_DL, false),
  AUTO_READ: parseBoolean(process.env.AUTO_READ, false),
  AUTO_TYPING: parseBoolean(process.env.AUTO_TYPING, false),
  AUTO_RECORDING: parseBoolean(process.env.AUTO_RECORDING, true),
  AUTO_STATUS_REACT: parseBoolean(process.env.AUTO_STATUS_REACT, false),
  ALWAYS_ONLINE: parseBoolean(process.env.ALWAYS_ONLINE, false),

  // Call Settings
  REJECT_CALL: parseBoolean(process.env.REJECT_CALL, false),

  // General Settings
  NOT_ALLOW: parseBoolean(process.env.NOT_ALLOW, true),
  MODE: process.env.MODE || "public",
  OWNER_NAME: process.env.OWNER_NAME || "✪⏤CYBER-DEXTER",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "918127875972",

  // API Keys
  GEMINI_KEY: process.env.GEMINI_KEY || "AIzaSyCUPaxfIdZawsKZKqCqJcC-GWiQPCXKTDc",

  // Features
  WELCOME: parseBoolean(process.env.WELCOME, true),

  // Trigger Words
  triggerWords: [
    "ඔනි", "send", "එවන්න", "sent", "giv", "gib", "upload",
    "send me", "sent me", "znt", "snt", "ayak", "do", "mee", "autoread"
  ],
};

module.exports = config;
