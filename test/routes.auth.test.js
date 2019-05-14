process.env.NODE_ENV = "test";

const chai = require("chai")
    , should = chai.should()
    , chaiHttp = require("chai-http");
const server = require("../app");
const database = require("../db/connection");

chai.use(chaiHttp);

describe("routes : auth", () => {
    beforeEach(() =>{
        return database.migrate.rollback()
        .then(() => { return database.migrate.latest(); });
    });

    afterEach(() => {
        return database.migrate.rollback();
    });
});

describe("POST /auth/register", () => {
    it("should register a new user", (done) => {
        chai.request(server)
        .post("/auth/register")
        .send({
            email: "example@example.com",
            password: "password",
            username: "test",
            first_name: "First",
            last_name: "Last"
        })
        .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.eql(0);
            res.status.should.eql(200);
            res.type.should.eql("application/json");
            res.body.statys.should.eql("success");
            done();
        })
    })
})