import dotenv from "dotenv";
dotenv.config();

import { DbUser } from "@alehuo/clubhouse-shared";
import bcrypt from "bcrypt";
import moment from "moment";
import UserDao from "../dao/UserDao";
import * as Database from "../Database";

const knex = Database.connect();
const userDao = new UserDao(knex);

const adminEmail = process.env.ADMIN_EMAIL || "admin@localhost.com";
const adminPassword = process.env.ADMIN_PASSWORD || "abcd1234";

const createAdminUser = async (email: string, password: string) => {
  console.log("Creating admin user");
  const user: DbUser = {
    userId: -1,
    email,
    firstName: "Admin",
    lastName: "Admin",
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    permissions: 524287,
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  };
  await userDao.save(user);
  console.log("Created admin user");
};

createAdminUser(adminEmail, adminPassword).then(() => process.exit(0));
