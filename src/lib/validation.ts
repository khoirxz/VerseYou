import { z } from "zod";

export const spotifyTrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  artists: z.array(z.string()).min(1),
  album: z.string(),
  image: z.url(),
  previewUrl: z.url().optional(),
});

export const createPostSchema = z.object({
  spotifyTrackSchema: spotifyTrackSchema,
  message: z.string().min(1),
  moodTags: z.array(z.string().min(1).max(20)).optional(),
});

export const cursorSchema = z.object({
  cursor: z.string().optional(),
});

export const likeToggleSchema = z.object({
  postId: z.string().min(1),
});

export const createCommentSchema = z.object({
  body: z.string().min(1),
  postId: z.string().min(1),
});

export const commentsCursorSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
});
