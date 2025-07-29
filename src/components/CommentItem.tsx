/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import type { Comment } from '@/lib/types'
import { IonIcon, IonItem, IonLabel, IonText } from '@ionic/react'
import { Effect } from 'effect'
import { chevronDown, chevronUp } from 'ionicons/icons'
import { relativify } from '@/lib/utils'
import './rainbow.css'

interface CommentItemProps {
  comment: Comment
  collapsedThreads: Set<number>
  toggleCollapse: (commentId: number) => void
  level?: number
}

export function CommentItem({ comment, collapsedThreads, toggleCollapse, level = 0 }: CommentItemProps) {
  const isCollapsed = collapsedThreads.has(comment.id)
  const depthColor = `var(--rainbow-depth-${((level % 7))})`

  return (
    <>
      <IonItem style={{
        'paddingInlineStart': `${level * 0.75}rem`,
        '--padding-start': 0,
        '--padding-end': 0,
        '--inner-padding-start': 0,
        '--inner-padding-end': 0,
      }}
      >
        <div
          className="top-2 absolute rounded-full w-0.5 h-[calc(100%-1rem)]"
          style={{
            backgroundColor: depthColor,
          }}
        />

        <div className="px-4 py-2 w-full">
          <IonLabel>
            <p
              onClick={() => toggleCollapse(comment.id)}
              className="flex items-center cursor-pointer"
            >
              {comment.user}
              <span className="mx-2">
                &bull;
              </span>
              {Effect.runSync(relativify(comment.time))}
              <span className="ml-auto">
                <IonIcon icon={!isCollapsed ? chevronUp : chevronDown} />
              </span>
            </p>
            {!isCollapsed && (
              <div>
                <IonText>
                  <div dangerouslySetInnerHTML={{ __html: comment.content }} />
                </IonText>
              </div>
            )}
          </IonLabel>
        </div>
      </IonItem>
      {!isCollapsed && comment.comments.map(reply => (
        <CommentItem
          key={reply.id}
          comment={reply}
          collapsedThreads={collapsedThreads}
          toggleCollapse={toggleCollapse}
          level={level + 1}
        />
      ))}
    </>
  )
}
