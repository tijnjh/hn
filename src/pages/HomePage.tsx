import StoryListing from "@/components/StoryListing";
import type { Story } from "@/lib/types";
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
    IonRefresher,
    IonRefresherContent,
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
        return await ofetch(
            `https://node-hnapi.herokuapp.com/news?page=${pageParam}`,
        );
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
                                <StoryListing key={story.id} story={story} />
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
