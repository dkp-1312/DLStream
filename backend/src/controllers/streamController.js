import Stream from "../models/Stream.js";
import crypto from "crypto";






export const createStream = async (req, res) => {
  const { title } = req.body;

  const streamKey = crypto.randomBytes(8).toString("hex");
  const watchScript=crypto.randomBytes(8).toString("hex");

  const stream = await Stream.create({ title, streamKey,watchScript });

  res.json(stream);
};

export const getStreams = async (req, res) => {
  const streams = await Stream.find().sort({ createdAt: -1 });
  res.json(streams);
};

export const getStreamByKey = async (req, res) => {
  const stream = await Stream.findOne({ streamKey: req.params.key });
  return stream;
};

export const getWatchScript = async (req, res) => {
  const stream = await Stream.findOne({ watchScript: req.params.key });
  res.json(stream);
};
