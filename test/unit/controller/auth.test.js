process.env.NODE_ENV = "test";

const mocha = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const mocks = require("node-mocks-http");

const testSetup = require("../helper/auth.test.setup");

const {
  loginRequired,
  passwordRequired,
  login,
  register,
} = require("../../../src/controllers/auth.controller");

chai.use(chaiHttp);
const expect = chai.expect;
describe("***********register***********", () => {
  testSetup();

  it("Register success when username and email is not registered by others", async () => {
    let inputData = {
      username: "truyen.le",
      email: "minhtruyen.le.89@gmail.com",
      password: "Qwerty@1234",
      firstName: "Truyen",
      lastName: "Le",
    };

    let req = mocks.createRequest({
      method: "POST",
      url: "/register",
      body: {
        ...inputData,
      },
    });

    let res = mocks.createResponse({ req: req });

    await register(req, res);
    let data = res._getJSONData();
    expect(res.statusCode).to.equal(201);
    expect(data.email).to.equal("minhtruyen.le.89@gmail.com");
    expect(data.password).to.equal(undefined);
    expect(data.hashPassword).to.equal(undefined);
    // done();
  });
});
