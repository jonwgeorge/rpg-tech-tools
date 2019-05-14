process.env.NODE_ENV = "test";

const chai = require("chai")
    , should = chai.should()
    , chaiHttp = require("chai-http");
const server = require("../app");

chai.use(chaiHttp);

describe("test", () => {
    it("should return status 200", () => {
        chai.request(server).get('/')
    });
});