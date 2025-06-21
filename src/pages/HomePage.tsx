import StoryListing from "@/components/StoryListing";
import type { EchoscrapeResponse, Story } from "@/lib/types";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { logoGithub } from "ionicons/icons";
import { ofetch } from "ofetch";
import { Fragment } from "react";

export default function HomePage() {
  async function fetchStories({ pageParam }: { pageParam: unknown }) {
    const stories = await ofetch(
      `https://node-hnapi.herokuapp.com/news?page=${pageParam}`,
    );

    stories
      .filter((story: Story) => !story.url.startsWith("https://"))
      .forEach((story: Story) => console.log(story.url));

    const metadatas = await Promise.all(
      stories.map((story: Story) =>
        story.url.startsWith("https://")
          ? ofetch<EchoscrapeResponse>(
            `https://echoscrape.tijn.dev/${story.url}`,
          )
          : Promise.resolve(undefined)
      ),
    );

    stories.forEach((story: Story, i: number) => {
      story.metadata = metadatas[i];
    });

    return stories;
  }
  const { isPending, data, fetchNextPage } = useInfiniteQuery<
    Story[]
  >({
    queryKey: ["stories"],
    queryFn: fetchStories,
    initialPageParam: 1,
    getNextPageParam: (_, allPages) => allPages.length + 1,
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton
              href="https://github.com/tijnjh/hn"
              target="_blank"
            >
              <IonIcon icon={logoGithub} />
            </IonButton>
          </IonButtons>
          <IonTitle>Frontpage</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Frontpage</IonTitle>
          </IonToolbar>
        </IonHeader>

        {isPending && <IonSpinner className="my-8 w-full" />}

        <IonList>
          {data?.pages.map((page, i) => (
            <Fragment key={i}>
              {page.map((story) => (
                <StoryListing
                  key={story.id}
                  story={story}
                />
              ))}
            </Fragment>
          ))}
        </IonList>

        <IonInfiniteScroll
          onIonInfinite={(e) => {
            fetchNextPage().finally(() => {
              e.target.complete();
            });
          }}
          threshold="100px"
        >
          <IonInfiniteScrollContent />
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
}
