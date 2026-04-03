import Stream from "../models/Stream.js";

// CREATE STREAM
export const createStream = async (req, res) => {
  const { title } = req.body;

  const stream = await Stream.create({ title });

  res.json({
    message: "Stream Created Successfully",
    streamId: stream._id,
    link:`${process.env.frontend_url}/stream/${stream._id}`,
  });
};

// GET STREAM INFO
export const getStream = async (req, res) => {
  const stream = await Stream.findById(req.params.id);

  if (!stream) return res.status(404).json({ message: "Stream Not Found" });

  res.json(stream);
};
