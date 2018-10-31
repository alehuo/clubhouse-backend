import Express from "express";

export default abstract class Controller {
  public router: Express.Router;

  constructor() {
    this.router = Express.Router();
  }

  public abstract routes(): Express.Router;
}
