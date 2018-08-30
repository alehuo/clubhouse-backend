process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "testSecret";

import { Permissions } from "@alehuo/clubhouse-shared";
import { expect } from "chai";
import "mocha";
import * as httpMocks from "node-mocks-http";
import { PermissionMiddleware } from "../../src/middleware/PermissionMiddleware";
import { VerifyToken } from "../../src/utils/JwtUtils";
import { IError } from "../../src/utils/MessageFactory";
import { generateToken } from "../TestUtils";
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();

describe("PermissionMiddleware", () => {
  it("Should return an error if the token is not set", async () => {
    let nextCalled: number = 0;
    const request: httpMocks.MockRequest<any> = httpMocks.createRequest({
      method: "GET",
      url: "/user/42",
      params: {
        id: 42
      }
    });
    const response: httpMocks.MockResponse<any> = httpMocks.createResponse();

    await PermissionMiddleware(Permissions.ALLOW_ADD_EVENT)(
      request,
      response,
      function(): void {
        nextCalled += 1;
      }
    );
    expect(nextCalled).to.equal(0);
    const data: IError = JSON.parse(response._getData());
    should.exist(data.error);
    should.exist(response.statusCode);
    expect(data.error).to.equal("Invalid token");
    expect(response.statusCode).to.equal(400);
  });

  it("Should return an error if the user has no permissions", async () => {
    let nextCalled: number = 0;
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
      // @ts-ignore
      locals: {
        token
      }
    });
    await PermissionMiddleware(Permissions.ALLOW_VIEW_STUDENT_UNIONS)(
      request,
      response,
      function(): void {
        nextCalled += 1;
      }
    );
    expect(nextCalled).to.equal(0);
    const data: IError = JSON.parse(response._getData());
    should.exist(data.error);
    should.exist(response.statusCode);
    expect(data.error).to.equal("Unauthorized");
    expect(response.statusCode).to.equal(400);
  });

  it("Should call next() if the user has permissions", async () => {
    let nextCalled: number = 0;
    const token: string | object = VerifyToken(
      generateToken({
        permissions: Math.pow(2, 4)
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
      // @ts-ignore
      locals: {
        token
      }
    });
    await PermissionMiddleware(Permissions.ALLOW_ADD_KEYS)(
      request,
      response,
      function(): void {
        nextCalled += 1;
      }
    );
    expect(nextCalled).to.equal(1);
  });
});
