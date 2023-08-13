const mongoose = require("mongoose");
const app = require("./app");
const { DB_HOST, PORT = 3000 } = process.env;
const connection = mongoose.connect(DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connection
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
