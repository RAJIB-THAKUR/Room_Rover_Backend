const cron = require("node-cron");
const User = require("../models/user.model");
const Seller = require("../models/seller.model");

//Delete unverified users and sellers older than 1 day
const deleteUnverifiedAccounts = async () => {
  console.log(`Date when deleted unverified accounts --> ${new Date()} `);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const unverifiedUsers = await User.find({
    verified: false,
    createdAt: { $lte: oneDayAgo },
  });
  await User.deleteMany({ verified: false, createdAt: { $lte: oneDayAgo } });
  console.log(`Deleted ${unverifiedUsers.length} unverified users`);

  const unverifiedSellers = await Seller.find({
    verified: false,
    createdAt: { $lte: oneDayAgo },
  });
  await Seller.deleteMany({ verified: false, createdAt: { $lte: oneDayAgo } });
  console.log(`Deleted ${unverifiedSellers.length} unverified sellers`);
};

// Schedule the function to run every day at 12:00 AM
cron.schedule("0 0 * * *", deleteUnverifiedAccounts);

// Call the function once at startup to clean up any existing unverified accounts
// deleteUnverifiedAccounts();

module.exports = deleteUnverifiedAccounts;
