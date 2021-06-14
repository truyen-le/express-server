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

  beforeEach((done) => {
    mongoose.connection.db
      .listCollections({ name: "users" })
      .next((error, collection) => {
        //deleting the collection before each
        if (collection) {
          //test case to avoid duplicated key error
          mongoose.connection.db
            .dropCollection("users")
            .then(() => done())
            .catch((err) => done(err));
        } else {
          done(error);
        }
      });
    // mongoose.connection.db
    //   .listCollections({ name: "auths" })
    //   .finally((error, collection) => {
    //     //deleting the collection before each
    //     if (collection) {
    //       //test case to avoid duplicated key error
    //       mongoose.connection.db
    //         .dropCollection("auths")
    //         // .then(() => done())
    //         .catch((err) => done(err));
    //     } else {
    //       done(error);
    //     }
    //   });
  });

  after((done) => {
    // runs after the last test case
    mongoose.connection.db.dropCollection("auths");
    mongoose.connection.db.dropCollection("users");
    mongoose
      .disconnect()
      .then(() => done())
      .catch((err) => done(err));
  });
};

module.exports = testSetup;
