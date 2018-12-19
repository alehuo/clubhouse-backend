import bcrypt from "bcrypt";
import UserDao from "../dao/UserDao";
import { SignToken, VerifyToken } from "../utils/JwtUtils";
import Controller from "./Controller";

import { isString, Permission } from "@alehuo/clubhouse-shared";
import axios from "axios";
import uuid from "uuid/v4";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { MessageFactory } from "../utils/MessageFactory";
import { hasPermissions } from "../utils/PermissionUtils";

interface SpotifyAuth {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

// Spotify configuration
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || "";
const clientId = process.env.SPOTIFY_CLIENT_ID || "";
const redirectUrl = process.env.SPOTIFY_REDIRECT_URL || "";
const scopes =
  "user-read-currently-playing user-read-playback-state user-read-recently-played";

export default class AuthController extends Controller {
  constructor(private userDao: UserDao) {
    super();
  }

  public routes() {
    this.router.post(
      "",
      RequestParamMiddleware("email", "password"),
      async (req, res) => {
        try {
          const {
            email,
            password
          }: {
            email: string;
            password: string;
          } = req.body;

          if (!isString(email) || !isString(password)) {
            return res
              .status(400)
              .json(
                MessageFactory.createError(
                  "Invalid request parameters: Email and password must be in correct format."
                )
              );
          }

          const user = await this.userDao.findByEmail(email);

          if (!user) {
            return res
              .status(400)
              .json(MessageFactory.createError("Invalid username or password"));
          } else {
            // User exists, check for pash
            const dbPwd = user.password;
            const inputPwd = password;

            try {
              const match = await bcrypt.compare(inputPwd, dbPwd);
              if (match) {
                const token = SignToken({
                  userId: user.userId,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  permissions: user.permissions
                });
                return res
                  .status(200)
                  .json(
                    MessageFactory.createResponse<{ token: string }>(
                      true,
                      "Authentication successful",
                      { ...{ token } }
                    )
                  );
              } else {
                return res
                  .status(400)
                  .json(
                    MessageFactory.createError("Invalid username or password")
                  );
              }
            } catch (ex) {
              return res
                .status(500)
                .json(
                  MessageFactory.createError(
                    "Server error: Cannot authenticate user",
                    ex as Error
                  )
                );
            }
          }
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Server error: Cannot authenticate user",
                err as Error
              )
            );
        }
      }
    );

    this.router.get("/spotify", async (req, res) => {
      const token = req.query.accessToken || null;
      // Check for token
      if (token === null) {
        return res.status(400).send("Unauthorized (1)");
      }
      // Validate token
      try {
        const tokenData: any = await VerifyToken(token);
        const permissions: number = tokenData.data.permissions;
        // If the user doesn't have the permission to use the Spotify API, return an error
        if (!hasPermissions(permissions, Permission.ACCESS_SPOTIFY_API)) {
          return res.status(400).send("Unauthorized (2)");
        }
      } catch (err) {
        return res.status(400).send("Unauthorized (3)");
      }
      // Generate secret
      const secret = uuid();
      // Set auth cookie
      return res
        .cookie("spotify_auth_state", secret)
        .redirect(
          "https://accounts.spotify.com/authorize" +
            "?response_type=code" +
            "&client_id=" +
            clientId +
            (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
            "&redirect_uri=" +
            encodeURIComponent(redirectUrl) +
            "&state=" +
            encodeURIComponent(secret)
        );
    });

    this.router.get("/spotify_callback", async (req, res) => {
      const code = req.query.code || null;
      const state = req.query.state || null;
      const storedState = req.cookies ? req.cookies.spotify_auth_state : null;
      if (state === null || state !== storedState) {
        req.clearCookie("spotify_auth_state");
        return res.status(400).send("Unauthorized (4)");
      } else {
        res.clearCookie("spotify_auth_state");
        const headers = {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization":
            "Basic " +
            Buffer.from(clientId + ":" + clientSecret).toString("base64")
        };
        const params = {
          grant_type: "authorization_code",
          redirect_uri: redirectUrl,
          code
        };
        try {
          // POST request to Spotify API for receiving the Bearer token
          const response = await axios.post<SpotifyAuth>(
            "https://accounts.spotify.com/api/token",
            null,
            {
              headers,
              params
            }
          );
          // Save the returned token data into database, with User ID
          // TODO: Store tokens & data in database
          // TODO: Add Cronjob to fetch latest data every minute
          console.log(response.data.access_token);
          return res.send("OK");
        } catch (err) {
          console.error(err.response.data);
          return res.status(400).send("Unauthorized (5)");
        }
      }
    });

    return this.router;
  }
}
