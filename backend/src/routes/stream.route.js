import express from "express";
import {protect} from "../middleware/auth.middleware.js";

import {createStream,getStream} from "../controllers/stream1.controller.js";

const routerStream = express.Router();

routerStream.post("/create",protect, createStream);
routerStream.get("/:id", protect, getStream);

export default routerStream;
