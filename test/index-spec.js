const chai = require("chai")
    , chaiHttp = require("chai-http");
const mocha = require('mocha');
const server = require("../app");

chai.use(chaiHttp);

describe("test", () => {
    it("should return status 200", () => {
        chai.request(server).get('/')
    })
})