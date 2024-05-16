<template>
  <ion-modal :is-open="modalOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>Упражнение</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="toggleModal()">Close</ion-button></ion-buttons
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>{{ data[dayNumber][exNumber].name }}</h2>
      <data-input
        label="Подходы"
        type="sets"
        :initialValue="data[dayNumber][exNumber].sets"
      ></data-input>
      <data-input
        label="Повторы"
        type="times"
        :initialValue="data[dayNumber][exNumber].times"
      ></data-input>
      <data-input
        label="Вес"
        type="weight"
        :initialValue="data[dayNumber][exNumber].weight"
      ></data-input>
      <data-input
        label="Комментарий"
        type="comment"
        :initialValue="data[dayNumber][exNumber].comment"
      ></data-input
      ><ion-toolbar>
        <ion-button slot="end" @click="saveEx"
          >Сохранить</ion-button
        ></ion-toolbar
      >
      <video
        v-if="data[dayNumber][exNumber].video"
        id="exersice-video"
        controls
        @click="playVideo()"
        @touchend="playVideo()"
      >
        <source :src="videoUrl" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import {
  IonTitle,
  IonContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
} from "@ionic/vue";
import { computed, defineProps, ref } from "vue";
import { useStore } from "vuex";
import DataInput from "./DataInput.vue";
const store = useStore();
const props = defineProps(["dayNumber", "exNumber"]);
const data = computed(() => store.getters.data);
const videoUrl = computed(() => {
  return "./videos/" + data.value[props.dayNumber][props.exNumber].video;
});
const isPlaying = ref(false);

const modalOpen = computed(() => store.getters.modalOpen);
const exInQuestion = computed(() => store.getters.exInQuestion);
function toggleModal() {
  store.dispatch("toggleModal");
  store.dispatch(
    "setExInQuestion",
    data.value[props.dayNumber][props.exNumber]
  );
}
function saveEx() {
  store.dispatch("saveExData", {
    dayNumber: props.dayNumber,
    exNumber: props.exNumber,
    exId: exInQuestion.value.exId,
    sets: exInQuestion.value.sets
      ? exInQuestion.value.sets
      : data.value[props.dayNumber][props.exNumber].sets,
    times: exInQuestion.value.times
      ? exInQuestion.value.times
      : data.value[props.dayNumber][props.exNumber].times,
    weight:
      exInQuestion.value.weight !== "0" && exInQuestion.value.weight !== 0
        ? exInQuestion.value.weight
        : data.value[props.dayNumber][props.exNumber].weight
        ? data.value[props.dayNumber][props.exNumber].weight
        : 0,
    comment: exInQuestion.value.comment.length
      ? exInQuestion.value.comment
      : data.value[props.dayNumber][props.exNumber].comment
      ? data.value[props.dayNumber][props.exNumber].comment
      : "",
  });
  store.dispatch("toggleModal");
}
function playVideo() {
  const video = document.querySelector("video");
  if (isPlaying.value) {
    video.pause();
  } else {
    video.play();
  }
  isPlaying.value = !isPlaying.value;
}
</script>

<style scoped>
video {
  width: 100%;
}
</style>