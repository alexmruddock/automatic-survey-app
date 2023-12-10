const mongoose = require("mongoose");
const User = require("./models/User"); // Adjust the path as necessary

require("dotenv").config();

const migrateData = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const users = await User.find({});

  for (let user of users) {
    
    // Initialize profile if it doesn't exist
    if (!user.profile) {
      user.profile = {};
    }

    // Set default values for the new profile fields
    user.profile.firstName = user.profile.firstName || "";
    user.profile.lastName = user.profile.lastName || "";
    user.profile.city = user.profile.city || "";
    user.profile.country = user.profile.country || "";
    user.profile.company = user.profile.company || "";
    user.profile.industry = user.profile.industry || "";
    user.profile.interests = user.profile.interests || [];
    user.profile.products = user.profile.products || [];
    user.profile.nps = user.profile.nps || 0;

    // Save the updated document
    await user.save();
  }

  console.log("Migration completed.");
};

migrateData().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
