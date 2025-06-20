import type { Story } from "@/lib/types";
import { formatUrl, relativify } from "@/lib/utils";
import { IonAvatar, IonIcon, IonItem, IonLabel, IonNote } from "@ionic/react";
import { arrowUp, chatbubble, chatbubbleOutline } from "ionicons/icons";
import LinkPreview from "./LinkPreview";

export default function StoryListing(
    { story, link = true }: { story: Story; link?: boolean },
) {
    return (
        <IonItem
            routerLink={link ? `/story/${story.id}` : undefined}
            draggable={false}
            detail={false}
            className="select-none"
        >
            <IonLabel>
                <h2>{story.title}</h2>

                <LinkPreview
                    url={story.url}
                    href={!link ? story.url : undefined}
                    className="my-2.5"
                />

                <h3 className="flex items-center text-(--gray-1)">
                    {story.points}
                    <IonIcon icon={arrowUp} />
                    <span className="mx-2">&bull;</span>
                    {story.comments_count}{" "}
                    repl{story.comments_count !== 1 ? "ies" : "y"}
                    <span className="mx-2">&bull;</span>
                    <span className="shrink-0">{relativify(story.time)}</span>
                    {story.url.startsWith("http") && (
                        <>
                            <span className="mx-2">&bull;</span>
                            <span className="truncate">
                                {formatUrl(story.url)}
                            </span>
                        </>
                    )}
                </h3>
            </IonLabel>
        </IonItem>
    );
}
