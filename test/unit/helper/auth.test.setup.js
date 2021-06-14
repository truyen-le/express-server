const mongoose = require("mongoose");

const TEST_DB_URL =
  "mongodb+srv://admin:S6Jb-NrhA7edCxe@cluster0.fmbhm.mongodb.net/express-server-test";

let testSetup = () => {
  before((done) => {
    // runs before the first test case
    mongoose.Promise = global.Promise;
    mongoose.connect(TEST_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      autoIndex: true,
    });
    mongoose.connection
      .once("open", () => done())
      .on("error", (error) => done(error));
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropCollection("auths");
    await mongoose.connection.db.dropCollection("users");
  });

  after(async () => {
    // runs after the last test case
    await mongoose.connection.dropDatabase();
    mongoose
      .disconnect()
      .then(() => done())
      .catch((err) => done(err));
  });
};

module.exports = testSetup;
