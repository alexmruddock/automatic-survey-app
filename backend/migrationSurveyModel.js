const mongoose = require("mongoose");
const Survey = require("./models/Survey"); // Adjust the path as necessary

require("dotenv").config();

const migrateSurveys = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const surveys = await Survey.find({});

  for (let survey of surveys) {
    
    // Initialize segments if it doesn't exist
    if (!survey.segments) {
      survey.segments = [];
    }

    // Optionally, you can add logic here to determine and assign
    // segments to each survey based on certain criteria.

    // Save the updated document
    await survey.save();
  }

  console.log("Survey migration completed.");
};

migrateSurveys().catch((err) => {
  console.error("Survey migration failed:", err.message);
  process.exit(1);
});
