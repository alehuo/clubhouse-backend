process.env.NODE_ENV = "test";

import { ApiResponse } from "@alehuo/clubhouse-shared";
import { expect } from "chai";
import "mocha";
import * as httpMocks from "node-mocks-http";
import { JWTMiddleware } from "../../src/middleware/JWTMiddleware";
import { generateToken } from "../TestUtils";

process.env.JWT_SECRET = "testSecret";

describe("JWTMiddleware", () => {
  it("Should return an error if the Authorization -header is missing", async () => {
    let nextCalled: number = 0;
    const request: httpMocks.MockRequest<any> = httpMocks.createRequest({
      method: "GET",
      url: "/user/42"
    });
    const response: httpMocks.MockResponse<any> = httpMocks.createResponse();

    expect(true).to.equal(true);
    await JWTMiddleware(request, response, function(): void {
      nextCalled += 1;
    });
    expect(nextCalled).to.equal(0);
    const data: ApiResponse<undefined> = JSON.parse(response._getData());
    expect(data.error!.message).to.equal("Missing Authorization header");
    expect(response.statusCode).to.equal(403);
  });

  it("Should return an error if the Authorization -header is malformed (Case 1)", async () => {
    let nextCalled = 0;
    const request: httpMocks.MockRequest<any> = httpMocks.createRequest({
      method: "GET",
      url: "/user/42",
      headers: {
        Authorization: "Test"
      }
    });
    const response: httpMocks.MockResponse<any> = httpMocks.createResponse();

    expect(true).to.equal(true);
    await JWTMiddleware(request, response, function() {
      nextCalled += 1;
    });
    expect(nextCalled).to.equal(0);
    const data: ApiResponse<undefined> = JSON.parse(response._getData());
    expect(data.error!.message).to.equal("Malformed Authorization header");
    expect(response.statusCode).to.equal(403);
  });

  it("Should return an error if the Authorization -header is malformed (Case 2)", async () => {
    let nextCalled = 0;
    const request: httpMocks.MockRequest<any> = httpMocks.createRequest({
      method: "GET",
      url: "/user/42",
      headers: {
        Authorization: "Bearer malformedToken1234"
      }
    });
    const response: httpMocks.MockResponse<any> = httpMocks.createResponse();

    await JWTMiddleware(request, response, function() {
      nextCalled += 1;
    });
    expect(nextCalled).to.equal(0);
    const data: ApiResponse<undefined> = JSON.parse(response._getData());
    expect(data.error!.message).to.equal("Malformed Authorization header");
    expect(response.statusCode).to.equal(403);
  });

  it("Should call next() if the token is valid", async () => {
    let nextCalled = 0;
    const token = generateToken();
    const request: httpMocks.MockRequest<any> = httpMocks.createRequest({
      method: "GET",
      url: "/user/42",
      params: {
        id: 42
      },
      headers: {
        Authorization: token
      }
    });
    const response: httpMocks.MockResponse<any> = httpMocks.createResponse();

    await JWTMiddleware(request, response, function() {
      nextCalled += 1;
    });
    expect(nextCalled).to.equal(1);
  });
});
