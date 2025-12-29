import express from "express";
import { usersRouter } from "./users/users.js";
import { computersRouter } from "./computers/computers.js";
import { printersRouter } from "./printers/printersRouter.js";

export const router = express.Router();

router.use("/users", usersRouter);
router.use("/computers", computersRouter);
router.use("/printers", printersRouter);

router.use((req, res) => {
  return res.status(404).json({
    message: `A rota ${req.originalUrl} não existe`,
  });
});
