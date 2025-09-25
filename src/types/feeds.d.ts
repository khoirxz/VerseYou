export interface FeedProps {
  items: Item[];
  nextCursor: string;
}

export interface Item {
  _id: string;
  userId: string;
  spotifyTrack: SpotifyTrack;
  message: string;
  moodTags: string[];
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  image: string;
}
