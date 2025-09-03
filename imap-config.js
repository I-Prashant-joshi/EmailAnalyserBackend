// imapService.js
require("dotenv").config();
const Imap = require('imap');
const { simpleParser } = require('mailparser');

const imapConfig = {
  user:"prashantjoshipj67@gmail.com",
  password: process.env.EMAIL_PASSWORD,
  host: process.env.IMAP_HOST || 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

// IMAP fetch function
async function fetchEmailFromIMAP(subjectFilter) {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) return reject(err);

        imap.search(['UNSEEN', ['SUBJECT', subjectFilter]], (err, results) => {
          if (err) {
            imap.end();
            return reject(err);
          }

          if (!results || !results.length) {
            imap.end();
            return resolve(null);
          }

          const fetch = imap.fetch(results.slice(-1), { bodies: '', struct: true });

          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (err) {
                  imap.end();
                  return reject(err);
                }

                // Convert headers map to plain object
                const headersObj = {};
                for (let [key, value] of parsed.headers) {
                  headersObj[key] = value;
                }

                resolve({
                  subject: parsed.subject,
                  headers: headersObj,
                  date: parsed.date,
                  from: parsed.from?.text,
                  to: parsed.to?.text
                });
              });
            });
          });

          fetch.once('end', () => {
            imap.end();
          });
        });
      });
    });

    imap.once('error', (err) => reject(err));
    imap.connect();
  });
}

module.exports = { fetchEmailFromIMAP };
