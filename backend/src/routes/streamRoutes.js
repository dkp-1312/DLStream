import express from 'express';
import {
  createStream,
  getStreams,
  getWatchScript,
} from "../controllers/streamController.js";

const routerS = express.Router();

routerS.post("/", createStream);
routerS.get("/", getStreams);
routerS.get("/:key", getWatchScript);

export default routerS;
