process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "testSecret";

import { ApiResponse, Permission } from "@alehuo/clubhouse-shared";
import { expect } from "chai";
import chai from "chai";
import "mocha";
import * as httpMocks from "node-mocks-http";
import { PermissionMiddleware } from "../../src/middleware/PermissionMiddleware";
import { VerifyToken } from "../../src/utils/JwtUtils";
import { generateToken } from "../TestUtils";
const should = chai.should();

describe("PermissionMiddleware", () => {
  it("Should return an error if the token is not set", async () => {
    let nextCalled = 0;
    const request: httpMocks.MockRequest<any> = httpMocks.createRequest({
      method: "GET",
      url: "/user/42",
      params: {
        id: 42
      }
    });
    const response: httpMocks.MockResponse<any> = httpMocks.createResponse();

    PermissionMiddleware(Permission.ALLOW_ADD_EDIT_REMOVE_EVENTS)(
      request,
      response,
      function() {
        nextCalled += 1;
      }
    );
    expect(nextCalled).to.equal(0);
    const data: ApiResponse<undefined> = JSON.parse(response._getData());
    should.exist(data.error);
    should.exist(data.error!.message);
    should.exist(response.statusCode);
    expect(data.error!.message).to.equal("Invalid token");
    expect(response.statusCode).to.equal(400);
  });

  it("Should return an error if the user has no permissions", async () => {
    let nextCalled = 0;
    const token: string | object = VerifyToken(
      generateToken({
        permissions: 2
      }).replace("Bearer ", "")
    );

    const request: httpMocks.MockRequest<any> = httpMocks.createRequest({
      method: "GET",
      url: "/user/42",
      params: {
        id: 42
      }
    });
    const response: httpMocks.MockResponse<any> = httpMocks.createResponse({
      locals: {
        token
      }
    });
    PermissionMiddleware(Permission.ALLOW_VIEW_STUDENT_UNIONS)(
      request,
      response,
      function() {
        nextCalled += 1;
      }
    );
    expect(nextCalled).to.equal(0);
    const data: ApiResponse<undefined> = JSON.parse(response._getData());
    should.exist(data.error);
    should.exist(data.error!.message);
    should.exist(response.statusCode);
    expect(data.error!.message).to.equal("Unauthorized");
    expect(response.statusCode).to.equal(400);
  });

  it("Should call next() if the user has permissions", async () => {
    let nextCalled = 0;
    const token: string | object = VerifyToken(
      generateToken({
        permissions: Permission.ALLOW_ADD_REMOVE_KEYS
      }).replace("Bearer ", "")
    );

    const request: httpMocks.MockRequest<any> = httpMocks.createRequest({
      method: "GET",
      url: "/user/42",
      params: {
        id: 42
      }
    });
    const response: httpMocks.MockResponse<any> = httpMocks.createResponse({
      locals: {
        token
      }
    });
    PermissionMiddleware(Permission.ALLOW_ADD_REMOVE_KEYS)(
      request,
      response,
      function() {
        nextCalled += 1;
      }
    );
    expect(nextCalled).to.equal(1);
  });
});
