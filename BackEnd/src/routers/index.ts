import express  from "express";
import { usersRouter } from "./users/users.js";

export const router = express.Router();

router.use("/users", usersRouter);

