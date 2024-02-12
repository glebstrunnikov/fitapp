<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Расписание тренировок</ion-title>
        <ion-button :color="editBtnColor" slot="end" @click="toggleEditMode"
          ><ion-icon slot="icon-only" :icon="pencilOutline"></ion-icon
        ></ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <exercise-modal
        :dayNumber="dayNumberInSpotlight"
        :exNumber="exNumberInSpotlight"
      ></exercise-modal>

      <ion-header collapse="condense"> </ion-header>

      <ion-card v-for="(day, dayNumber) in data" :key="dayNumber">
        <ion-card-header>
          <ion-card-title>День {{ dayNumber + 1 }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-button
            v-if="editMode"
            slot="start"
            @click="toggleAlert(true, dayNumber)"
            ><ion-icon :icon="close"></ion-icon
          ></ion-button>

          <ion-alert
            :is-open="alertOpen"
            header="Точно удалить?"
            :buttons="alertBtns"
          ></ion-alert>

          <ion-button v-if="editMode" slot="end"
            ><ion-icon :icon="add"></ion-icon
          ></ion-button>
          <ion-card-subtitle>Subtitle {{ editMode }}</ion-card-subtitle>
          <ion-list>
            <ion-item v-for="(ex, exNumber) in day" :key="exNumber">
              <ion-label @click="toggleModal(dayNumber, exNumber)"
                ><h4>{{ ex.name }}</h4>
                <p>
                  {{ ex.sets }} подходов по {{ ex.times }} раз с весом
                  {{ ex.weight }}
                </p></ion-label
              >
              <ion-button
                v-if="editMode"
                @click="deleteEx(dayNumber, exNumber)"
                color="danger"
              >
                <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
// IMPORTS
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonAlert,
} from "@ionic/vue";

import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { trashOutline, pencilOutline, close, add } from "ionicons/icons";
import ExerciseModal from "../components/ExerciseModal.vue";
const store = useStore();

// VARS
const editBtnColor = ref("primary");
const editMode = computed(() => {
  return store.getters.editMode;
});
const data = computed(() => store.getters.data);
const dayNumberInSpotlight = ref();
const exNumberInSpotlight = ref();
const alertOpen = ref(false);

//FUNCTIONS
function deleteEx(dayNumber, exNumber) {
  store.dispatch({
    type: "deleteEx",
    payload: { dayNumber: dayNumber, exNumber: exNumber },
  });
}
function deleteDay(dayNumber) {
  store.dispatch("deleteDay", { dayNumber: dayNumber });
}
function toggleEditMode() {
  store.dispatch({ type: "toggleEditMode" });
  if (editBtnColor.value === "primary") {
    editBtnColor.value = "medium";
  } else {
    editBtnColor.value = "primary";
  }
}
function toggleModal(dayNumber, exNumber) {
  store.dispatch("toggleModal");
  dayNumberInSpotlight.value = dayNumber;
  exNumberInSpotlight.value = exNumber;
}
function toggleAlert(state, dayNumber) {
  console.log(alertOpen.value);
  if (dayNumber) {
    dayNumberInSpotlight.value = dayNumber;
  }
  if (state) {
    alertOpen.value = state;
    return;
  } else {
    alertOpen.value = !alertOpen.value;
  }
  console.log(alertOpen.value);
}

const alertBtns = [
  {
    text: "Отмена",
    role: "cancel",
    handler: () => {
      toggleAlert(false);
    },
  },
  {
    text: "Удалить",
    role: "confirm",
    handler: () => {
      deleteDay(dayNumberInSpotlight.value);
      toggleAlert(false);
    },
  },
];

onMounted(() => {});
</script>

<style scoped>
</style>