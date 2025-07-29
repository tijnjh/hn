/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
import type { Story } from '@/lib/types'
import { IonAvatar, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRefresher, IonRefresherContent, IonSpinner, IonToolbar } from '@ionic/react'
import { useQuery } from '@tanstack/react-query'
import { Effect, Schema } from 'effect'
import { arrowUp, openOutline } from 'ionicons/icons'
import { haptic } from 'ios-haptics'
import { ofetch } from 'ofetch'
import { useEffect, useMemo, useState } from 'react'
import { tryCatch } from 'typecatch'
import { CommentItem } from '@/components/CommentItem'
import * as s from '@/lib/types'
import { formatUrl, relativify } from '@/lib/utils'

interface StoryPageProps {
  match: {
    params: {
      id: string
    }
  }
}

export default function StoryPage({ match: { params } }: StoryPageProps) {
  const [collapsedThreads, setCollapsedThreads] = useState<Set<number>>(() => new Set())
  const [story, setStory] = useState<Story>()
  const [comments, setComments] = useState<Story['comments']>()

  function toggleCollapse(commentId: number) {
    haptic()
    const newSet = new Set(collapsedThreads)
    newSet[newSet.has(commentId) ? 'delete' : 'add'](commentId)
    setCollapsedThreads(newSet)
  }

  const url = `https://node-hnapi.herokuapp.com/item/${params.id}`

  const { isPending, data: raw, refetch } = useQuery({
    queryKey: [`story-${params.id}`],
    queryFn: () => ofetch(url),
  })

  const data = useMemo(() => raw ? Schema.decodeSync(s.story)(raw) : {} as Story, [raw])

  useEffect(() => {
    if (!story) {
      const sessionStory = sessionStorage.getItem(params.id)
      if (sessionStory) {
        setStory(JSON.parse(sessionStory))
      }
      else if (data) {
        setStory(data)
      }
    }
  }, [data, story, params.id])

  useEffect(() => {
    if (data?.comments) {
      setComments(data.comments)
    }
  }, [data])

  const isExternalLink = story?.url.startsWith('http')

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Frontpage" default-href="/" />
          </IonButtons>

          <IonButtons slot="end">
            {isExternalLink && (
              <IonButton href={story?.url} target="_blank">
                {story?.url && (tryCatch(() => Effect.runSync(formatUrl(story.url))).data ?? '')}
                <IonIcon slot="end" icon={openOutline} />
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        <IonRefresher
          slot="fixed"
          onIonRefresh={async (e) => {
            await refetch()
            e.detail.complete()
          }}
        >
          <IonRefresherContent />
        </IonRefresher>

        {story && (
          <>
            <IonList className="mb-2">
              <IonItem
                href={isExternalLink ? story.url : undefined}
                target="_blank"
              >
                <IonAvatar
                  aria-hidden="true"
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
                    <span className="mx-2">
                      &bull;
                    </span>
                    <span className="shrink-0">
                      {Effect.runSync(relativify(story.time))}
                    </span>
                    {isExternalLink && (
                      <>
                        <span className="mx-2">
                          &bull;
                        </span>
                        <span className="truncate">
                          {Effect.runSync(relativify(story.time))}
                        </span>
                      </>
                    )}
                  </h3>
                </IonLabel>
              </IonItem>
            </IonList>
            {comments && comments.map(comment => (
              <IonList key={comment.id} className="mb-2">
                <CommentItem
                  comment={comment}
                  collapsedThreads={collapsedThreads}
                  toggleCollapse={toggleCollapse}
                />
              </IonList>
            ))}
          </>
        )}
        {isPending && <IonSpinner className="my-8 w-full" />}

      </IonContent>
    </IonPage>
  )
}
