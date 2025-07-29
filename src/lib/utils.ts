import { formatDistanceToNow } from 'date-fns'
import { Data, Effect, Schema } from 'effect'

export const relativify = Effect.fn(function* (uts: number) {
  const timestamp = uts * 1000
  const date = new Date(timestamp)
  const formatted = formatDistanceToNow(date, { addSuffix: true })
  return formatted.replace('about', '')
})

export class UrlParsingError extends Data.TaggedError('UrlParsingError')<{ message: string }> {}

export const formatUrl = Effect.fn(function* (url: string) {
  return yield* Schema.decode(Schema.URL)(url).pipe(
    Effect.map(({ hostname }) => hostname.replace(/^www\./, '')),
  )
})
