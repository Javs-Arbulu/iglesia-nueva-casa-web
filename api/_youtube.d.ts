export const YOUTUBE_CHANNEL_ID: string

export interface FeedVideo {
  id: string
  title: string
  published: string
  url: string
  thumbnail: string
}

export interface LiveStatus {
  live: boolean
  videoId?: string
}

export function parseFeed(xml: string, limit?: number): FeedVideo[]
export function getPredicas(limit?: number): Promise<FeedVideo[]>
export function getLiveStatus(): Promise<LiveStatus>
