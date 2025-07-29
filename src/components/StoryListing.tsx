import type { Story } from '@/lib/types'
import { IonAvatar, IonIcon, IonItem, IonLabel, IonNote } from '@ionic/react'
import { Effect } from 'effect'
import { arrowUp } from 'ionicons/icons'
import { tryCatch } from 'typecatch'
import { formatUrl, relativify } from '@/lib/utils'

export default function StoryListing({ story }: { story: Story }) {
  const { data: url = '' } = tryCatch(() => Effect.runSync(formatUrl(story.url)))

  return (
    <IonItem
      routerLink={`/story/${story.id}`}
      onClick={() => {
        sessionStorage.setItem(
          String(story.id),
          JSON.stringify(story),
        )
      }}
      draggable={false}
      detail
      className="select-none"
    >
      <IonAvatar
        aria-hidden
        slot="start"
      >
        <img
          className="rounded-sm! bg-(--gray-5)"
          src={`https://www.google.com/s2/favicons?domain=${story.url}&sz=64`}
        />
      </IonAvatar>
      <IonLabel>
        <h2>{story.title}</h2>
        <h3 className="flex items-center">
          {story.points}
          <IonIcon icon={arrowUp} />
          <span className="mx-2">&bull;</span>
          <span className="shrink-0">{Effect.runSync(relativify(story.time))}</span>
          {story.url.startsWith('http') && (
            <>
              <span className="mx-2">&bull;</span>
              <span className="truncate">
                {url}
              </span>
            </>
          )}
        </h3>
      </IonLabel>
      <IonNote>{story.comments_count}</IonNote>
    </IonItem>
  )
}
