import { EgressClient } from "livekit-server-sdk";

const egressClient = new EgressClient(
  process.env.LIVEKIT_HOST,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export const startRTMPStream = async (roomName, streamKey) => {
  const rtmpUrl = `rtmp://localhost/live/${streamKey}`;

  const res = await egressClient.startRoomCompositeEgress(
    roomName,
    {
      layout: "speaker", // speaker | grid
      audioOnly: false,
      outputs: [
        {
          rtmpUrl,
        },
      ],
    }
  );

  return res;
};

export const stopRTMPStream = async (egressId) => {
  return await egressClient.stopEgress(egressId);
};