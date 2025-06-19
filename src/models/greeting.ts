import { Schema, model, models } from "mongoose";

const GreetingSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    music: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Greeting = models.Greeting || model("Greeting", GreetingSchema);
