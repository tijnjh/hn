import { Schema } from 'effect'

export const comment = Schema.Struct({
  id: Schema.Number,
  level: Schema.Number,
  user: Schema.String,
  time: Schema.Number,
  time_ago: Schema.String,
  content: Schema.String,
  comments: Schema.Array(Schema.Any),
})

export type Comment = Schema.Schema.Type<typeof comment>

export const story = Schema.Struct({
  id: Schema.Number,
  title: Schema.String,
  points: Schema.Number,
  user: Schema.String,
  time: Schema.Number,
  time_ago: Schema.String,
  comments_count: Schema.Number,
  type: Schema.Literal('link'),
  url: Schema.String,
  domain: Schema.optional(Schema.String),
  comments: Schema.optional(Schema.Array(comment)),
})

export type Story = Schema.Schema.Type<typeof story>
