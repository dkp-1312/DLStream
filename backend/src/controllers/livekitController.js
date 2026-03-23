import { AccessToken } from "livekit-server-sdk";

export const livekitController = async (req, res) => {

  const { room, username } = req.body;

  const apiKey = "APIKEY123";
  const apiSecret = "e41c1f3a8f4c92c6";

  const at = new AccessToken(apiKey, apiSecret, {
    identity: username,
  });

  at.addGrant({
    roomJoin: true,
    room
  });

  const token = await at.toJwt();

  res.json({ token });
};