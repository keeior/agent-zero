'use client';

import { useCallback, useEffect, useState } from 'react';
import { RoomEvent } from 'livekit-client';
import { useSessionContext } from '@livekit/components-react';

/**
 * Display message types sent from the agent via the 'tool-display' data channel.
 */
export type ToolDisplayType = 'loading' | 'results' | 'media' | 'webpage' | 'close' | 'fullscreen';

export interface ToolDisplayItem {
  title: string;
  snippet: string;
  url: string;
}

export interface ToolDisplayMessage {
  type: ToolDisplayType;
  title?: string;
  items?: ToolDisplayItem[];
  media_type?: 'image' | 'video' | 'youtube';
  url?: string;
  thumbnail?: string;
  content?: string;
  enabled?: boolean;
}

export interface ToolDisplayState {
  isOpen: boolean;
  isFullscreen: boolean;
  isLoading: boolean;
  message: ToolDisplayMessage | null;
  close: () => void;
  toggleFullscreen: () => void;
}

const TOPIC = 'tool-display';

/**
 * Hook that subscribes to the 'tool-display' data channel
 * and manages the display panel state.
 */
export function useToolDisplay(): ToolDisplayState {
  const { room } = useSessionContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<ToolDisplayMessage | null>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsFullscreen(false);
    setIsLoading(false);
    setMessage(null);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!room) return;

    const handleData = (
      payload: Uint8Array,
      _participant: unknown,
      _kind: unknown,
      topic?: string
    ) => {
      if (topic !== TOPIC) return;

      try {
        const text = new TextDecoder().decode(payload);
        const msg: ToolDisplayMessage = JSON.parse(text);

        switch (msg.type) {
          case 'loading':
            setIsLoading(true);
            setIsOpen(true);
            setMessage(msg);
            break;

          case 'results':
          case 'media':
          case 'webpage':
            setIsLoading(false);
            setIsOpen(true);
            setMessage(msg);
            break;

          case 'close':
            close();
            break;

          case 'fullscreen':
            setIsFullscreen(msg.enabled ?? false);
            break;
        }
      } catch {
        // ignore malformed messages
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room, close]);

  return { isOpen, isFullscreen, isLoading, message, close, toggleFullscreen };
}
