const mongoose = require("mongoose");
const Survey = require("./models/Survey"); // Adjust the path as necessary

require("dotenv").config();

const DEFAULT_IMAGE_URL = "https://site.surveysparrow.com/wp-content/uploads/2021/07/9-Different-Types-of-Survey-Methods@2x-8.png";

const migrateData = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const surveys = await Survey.find({});

  for (let survey of surveys) {
    if (!survey.imageUrl) {
      survey.imageUrl = DEFAULT_IMAGE_URL;
      await survey.save();
    }
  }

  console.log("Migration completed.");
};

migrateData().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
