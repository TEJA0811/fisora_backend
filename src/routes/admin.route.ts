import express, { type Request, type Response, type NextFunction } from "express";
import { isLogged } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/admin_login", (req, res) => {
  res.send("login");
});

router.post("/admin_change_password", (req, res) => {
  res.send("change_password");
});

router.post("/add_fish", isLogged, (req, res) => {
  res.send("add_fish");
});

router.post("/update_fish", isLogged, (req, res) => {
  res.send("update_fish");
});

router.delete("/fish", isLogged, (req, res) => {
  res.send("delete fish");
});

// middleware that is specific to this router
const timeLog = (req: Request, res: Response, next: NextFunction) => {
  console.log("Time: ", Date.now());
  next();
};

router.use(timeLog);

export default router;
