<template>
  <ion-modal :is-open="modalOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>Modal</ion-title>
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
      ><ion-buttons>
        <ion-button @click="saveEx">Сохранить</ion-button></ion-buttons
      >
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
import { computed, defineProps, onMounted } from "vue";
import { useStore } from "vuex";
import DataInput from "./DataInput.vue";
const store = useStore();
const props = defineProps(["dayNumber", "exNumber"]);
const data = computed(() => store.getters.data);
onMounted(() => {
  //   console.log(data);
  //   console.log(data.value[props.dayNumber][props.exNumber]);
  //   console.log(props.dayNumber);
});
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
    sets: exInQuestion.value.sets,
    times: exInQuestion.value.times,
    weight: exInQuestion.value.weight ? exInQuestion.value.weight : "",
    comment: exInQuestion.value.comment ? exInQuestion.value.comment : "",
  });
  store.dispatch("toggleModal");
}
</script>
