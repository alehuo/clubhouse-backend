import { Router } from "express";
import * as Express from "express";

export default abstract class Controller {
  public router: Router;

  constructor() {
    this.router = Express.Router();
  }

  public abstract routes(): Router;
}
