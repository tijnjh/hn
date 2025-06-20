import StoryListing from "@/components/StoryListing";
import type { Comment, Story } from "@/lib/types";
import { formatUrl, relativify } from "@/lib/utils";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { chevronDown, chevronUp, openOutline } from "ionicons/icons";
import { haptic } from "ios-haptics";
import { ofetch } from "ofetch";
import { useState } from "react";

interface StoryPageProps {
  match: {
    params: {
      id: string;
    };
  };
}

export default function StoryPage({ match: { params } }: StoryPageProps) {
  const [collapsedThreads, setCollapsedThreads] = useState<Set<number>>(
    new Set(),
  );

  function toggleCollapse(commentId: number) {
    haptic();
    const newSet = new Set(collapsedThreads);

    if (newSet.has(commentId)) {
      newSet.delete(commentId);
    } else {
      newSet.add(commentId);
    }
    setCollapsedThreads(newSet);
  }
  const url = `https://node-hnapi.herokuapp.com/item/${params.id}`;

  const { isPending, data: story } = useQuery<Story>({
    queryKey: [`story-${params.id}`],
    queryFn: () => ofetch(url),
  });

  const isExternalLink = story?.url?.startsWith("http");

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
                {formatUrl(story?.url!)}
                <IonIcon slot="end" icon={openOutline} />
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        {isPending && <IonSpinner className="my-8 w-full" />}

        {story && (
          <>
            <IonList className="mb-2">
              <StoryListing link={false} story={story} />
            </IonList>
            {story.comments.map((comment) => (
              <IonList
                key={comment.id}
                className="mb-2"
              >
                <IonItem>
                  <IonLabel>
                    <p
                      onClick={() => {
                        toggleCollapse(comment.id);
                      }}
                      className="flex items-center cursor-pointer"
                    >
                      {comment.user}
                      <span className="mx-2">
                        &bull;
                      </span>
                      {relativify(comment.time)}
                      <span className="ml-auto">
                        {!collapsedThreads.has(
                            comment.id,
                          )
                          ? (
                            <IonIcon
                              icon={chevronUp}
                            />
                          )
                          : (
                            <IonIcon
                              icon={chevronDown}
                            />
                          )}
                      </span>
                    </p>
                    {!collapsedThreads.has(comment.id) &&
                      (
                        <div>
                          <IonText>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: comment
                                  .content,
                              }}
                            />
                          </IonText>
                        </div>
                      )}
                  </IonLabel>
                </IonItem>
                {!collapsedThreads.has(comment.id) &&
                  comment.comments.map((reply: Comment) => (
                    <IonItem
                      key={reply.id}
                      style={{
                        paddingLeft: `${reply.level}rem`,
                      }}
                    >
                      <IonLabel>
                        <p className="flex items-center">
                          {reply.user}
                          <span className="mx-2">
                            &bull;
                          </span>
                          {relativify(reply.time)}
                        </p>

                        <IonText>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: reply
                                .content,
                            }}
                          />
                        </IonText>
                      </IonLabel>
                    </IonItem>
                  ))}
              </IonList>
            ))}
          </>
        )}
      </IonContent>
    </IonPage>
  );
}
