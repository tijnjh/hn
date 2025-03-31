import { useEffect, useState } from "react";
import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonToolbar,
  useIonViewWillEnter,
  IonIcon,
  IonSpinner,
  IonButton,
} from "@ionic/react";
import { useParams } from "react-router";
import "./ViewStory.css";
import { arrowUp, openOutline } from "ionicons/icons";
import { formatUrl, relativify } from "../lib/helpers";
import type { Story, Comment } from "../lib/types";

async function fetchStory(id: number) {
  const url = `https://node-hnapi.herokuapp.com/item/${id}`;
  const response = await (await fetch(url)).json();
  return response;
}

function ViewMessage() {
  const [story, setStory] = useState<Story>();
  const [collapsedThreads, setCollapsedThreads] = useState<Set<number>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const params = useParams<{ id: string }>();

  const loadStory = async (id: number) => {
    setLoading(true);
    const storyData = await fetchStory(id);
    setStory(storyData);
    setLoading(false);
  };

  useIonViewWillEnter(() => {
    loadStory(Number.parseInt(params.id, 10));
  });

  const toggleCollapse = (commentId: number) => {
    setCollapsedThreads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  useEffect(() => {
	for (const a of document.querySelectorAll("a")) {
		a.target = "_blank"
	}
  }, []);

  return (
    <IonPage id="view-message-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Frontpage" defaultHref="/" />
          </IonButtons>

          <IonButtons slot="end">
            {!!story && (
              <IonButton href={story.url} target="_blank">
                {formatUrl(story.url)}
                <IonIcon slot="end" icon={openOutline} />
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        {!!loading && (
          <IonSpinner style={{ width: "100%", marginBlockStart: "2rem" }} />
        )}

        {story ? (
          <>
            <IonList style={{ marginBottom: ".5rem" }}>
              <IonItem href={story.url} target="_blank">
                <IonAvatar
                  aria-hidden="true"
                  slot="start"
                  style={{ "--border-radius": ".25rem" }}
                >
                  <img
                    alt=""
                    src={`https://www.google.com/s2/favicons?domain=${story.url}&sz=64`}
                  />
                </IonAvatar>
                <IonLabel>
                  <h2>{story.title}</h2>
                  <h3 style={{ display: "flex", alignItems: "center" }}>
                    {story.points}
                    <IonIcon icon={arrowUp} />
                    <span style={{ marginInline: ".5rem" }}>&bull;</span>
                    <span style={{ flexShrink: 0 }}>
                      {relativify(story.time)}
                    </span>
                    <span style={{ marginInline: ".5rem" }}>&bull;</span>
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {formatUrl(story.url)}
                    </span>
                  </h3>
                </IonLabel>
              </IonItem>
            </IonList>

            {story.comments.map((comment: Comment) => (
              <IonList key={comment.id} style={{ marginBottom: ".5rem" }}>
                <IonItem>
                  <IonLabel>
                    <p
                      onClick={() => toggleCollapse(comment.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      {comment.user}
                      <span style={{ marginInline: ".5rem" }}>&bull;</span>
                      {relativify(comment.time)}
                    </p>
                    <div
                      className={`comment-content ${
                        collapsedThreads.has(comment.id)
                          ? "collapsed"
                          : "expanded"
                      }`}
                    >
                      <IonText>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: comment.content,
                          }}
                        />
                      </IonText>
                    </div>
                  </IonLabel>
                </IonItem>
                {!collapsedThreads.has(comment.id) && (
                  comment.comments.map((reply: Comment) => (
                      <IonItem
                        key={reply.id}
                        style={{ paddingLeft: `${reply.level}rem` }}
                      >
                        <IonLabel>
                          <p style={{ display: "flex", alignItems: "center" }}>
                            {reply.user}
                            <span style={{ marginInline: ".5rem" }}>
                              &bull;
                            </span>
                            {relativify(reply.time)}
                          </p>

                          <div
                            className={`comment-content ${
                              collapsedThreads.has(comment.id)
                                ? "collapsed"
                                : "expanded"
                            }`}
                          >
                            <IonText>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: reply.content,
                                }}
                              />
                            </IonText>
                          </div>
                        </IonLabel>
                      </IonItem>
                    ))
                )}
              </IonList>
            ))}
          </>
        ) : (
          ""
        )}
      </IonContent>
    </IonPage>
  );
}

export default ViewMessage;
