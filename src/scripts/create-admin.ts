import bcrypt from "bcrypt";
import Knex from "knex";
import UserDao from "../dao/UserDao";
import * as Database from "../Database";
import { IUser } from "../models/IUser";

const knex: Knex = Database.connect();
const userDao: UserDao = new UserDao(knex);

const adminEmail: string = process.env.ADMIN_EMAIL || "admin@localhost.com";
const adminPassword: string = process.env.ADMIN_PASSWORD || "abcd1234";

const createAdminUser: (
  email: string,
  password: string
) => Promise<void> = async (email: string, password: string): Promise<void> => {
  console.log("Creating admin user");
  const user: IUser = {
    email,
    firstName: "Admin",
    lastName: "Admin",
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    permissions: 67108863
  };
  await userDao.save(user);
  console.log("Created admin user");
};

createAdminUser(adminEmail, adminPassword).then(() => process.exit(0));
