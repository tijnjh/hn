<script setup lang="ts">
import {
  IonAvatar,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonNote,
} from "@ionic/vue";

import { arrowUp, openOutline } from "ionicons/icons";
import { formatUrl, relativify } from "../utils";
import { Story } from "../types";

defineProps<{
  story: Story;
}>();
</script>

<template>
  <ion-item-sliding>
    <ion-item
      :router-link="`/story/${story.id}`"
      :draggable="false"
      detail
      :style="{
        userSelect: 'none',
        '-webkit-user-drag': 'none',
        '-moz-user-drag': 'none',
      }"
    >
      <ion-avatar
        aria-hidden="true"
        slot="start"
        :style="{ '--border-radius': '.25rem' }"
      >
        <img
          alt=""
          :src="`https://www.google.com/s2/favicons?domain=${story.url}&sz=64`"
        />
      </ion-avatar>
      <ion-label>
        <h2>{{ story.title }}</h2>
        <h3 style="display: flex; align-items: center">
          {{ story.score }}
          <ion-icon :icon="arrowUp" />
          <span style="margin-inline: 0.5rem">&bull;</span>
          <span style="flex-shrink: 0">{{ relativify(story.time) }}</span>
          <span style="margin-inline: 0.5rem">&bull;</span>
          <span
            style="
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            "
          >
            {{ formatUrl(story.url) }}
          </span>
        </h3>
      </ion-label>
      <ion-note>{{ story.descendants }}</ion-note>
    </ion-item>
    <ion-item-options side="start">
      <ion-item-option>
        <ion-icon slot="icon-only" :icon="openOutline" />
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</template>
