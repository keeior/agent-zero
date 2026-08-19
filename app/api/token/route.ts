import { NextResponse } from 'next/server';
import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';
import { RoomConfiguration } from '@livekit/protocol';

type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

export async function POST(req: Request) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const livekitUrl = process.env.LIVEKIT_URL;

  try {
    if (!livekitUrl) {
      console.error('LIVEKIT_URL environment variable is missing.');
      return NextResponse.json(
        { error: 'LIVEKIT_URL environment variable is not defined on server' },
        { status: 500 }
      );
    }
    if (!apiKey) {
      console.error('LIVEKIT_API_KEY environment variable is missing.');
      return NextResponse.json(
        { error: 'LIVEKIT_API_KEY environment variable is not defined on server' },
        { status: 500 }
      );
    }
    if (!apiSecret) {
      console.error('LIVEKIT_API_SECRET environment variable is missing.');
      return NextResponse.json(
        { error: 'LIVEKIT_API_SECRET environment variable is not defined on server' },
        { status: 500 }
      );
    }

    // Parse request body safely
    let body: any = {};
    try {
      const text = await req.text();
      if (text && text.trim().length > 0) {
        body = JSON.parse(text);
      }
    } catch (e) {
      console.warn('Could not parse request JSON body in /api/token:', e);
    }

    let roomConfig: RoomConfiguration | undefined = undefined;
    if (body && body.room_config) {
      try {
        roomConfig = RoomConfiguration.fromJson(body.room_config, { ignoreUnknownFields: true });
      } catch (err) {
        console.warn('Failed to parse room_config from request body:', err);
      }
    }

    // Generate participant token
    const participantName = 'user';
    const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`;
    const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;

    const participantToken = await createParticipantToken(
      apiKey,
      apiSecret,
      { identity: participantIdentity, name: participantName },
      roomName,
      roomConfig
    );

    // Return connection details
    const data: ConnectionDetails = {
      serverUrl: livekitUrl,
      roomName,
      participantName,
      participantToken,
    };
    const headers = new Headers({
      'Cache-Control': 'no-store',
    });
    return NextResponse.json(data, { headers });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error generating LiveKit token:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function createParticipantToken(
  apiKey: string,
  apiSecret: string,
  userInfo: AccessTokenOptions,
  roomName: string,
  roomConfig: RoomConfiguration | undefined
): Promise<string> {
  const at = new AccessToken(apiKey, apiSecret, {
    ...userInfo,
    ttl: '15m',
  });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);

  if (roomConfig) {
    at.roomConfig = roomConfig;
  }

  return at.toJwt();
}
