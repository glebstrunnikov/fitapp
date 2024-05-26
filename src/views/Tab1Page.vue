<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Расписание тренировок</ion-title>
        <!-- <button style="font-size: 30px; margin: 30px" @click="testReq">
          test
        </button> -->
        <ion-button
          v-if="editMode"
          :color="editBtnColor"
          slot="end"
          @click="addDay"
          ><ion-icon slot="icon-only" :icon="sunny"></ion-icon
        ></ion-button>
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

          <ion-button
            @click="togglePicker(true, dayNumber)"
            v-if="editMode"
            slot="end"
            ><ion-icon :icon="add"></ion-icon
          ></ion-button>

          <ion-picker
            :is-open="pickerOpen"
            :columns="pickerCols"
            :buttons="pickerBtns"
          ></ion-picker>

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
  IonPicker,
} from "@ionic/vue";

import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { trashOutline, pencilOutline, close, add, sunny } from "ionicons/icons";
import ExerciseModal from "../components/ExerciseModal.vue";

const store = useStore();

// VARS
const editBtnColor = ref("primary");
const editMode = computed(() => {
  return store.getters.editMode;
});
const data = computed(() => store.getters.data);
const exercises = computed(() => store.getters.exercises);
const dayNumberInSpotlight = ref();
const exNumberInSpotlight = ref();
const alertOpen = ref(false);
const pickerOpen = ref(false);

const pickerCols = [
  {
    name: "Упражнения",
    options: exercises.value.map((ex) => {
      return {
        text: ex.name,
        value: ex.id,
      };
    }),
  },
];
const pickerBtns = [
  {
    text: "Отмена",
    role: "cancel",
    handler: () => {
      togglePicker(false);
    },
  },
  {
    text: "Добавить",
    handler: (value) => {
      store.dispatch("addEx", {
        dayNumber: dayNumberInSpotlight.value,
        exId: value.Упражнения.value,
      });
      togglePicker(false);
    },
  },
];
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

//FUNCTIONS

function testReq() {
  console.log("testReq initiated");
  store.dispatch("loadLocalData");
}

function deleteEx(dayNumber, exNumber) {
  store.dispatch({
    type: "deleteEx",
    payload: { dayNumber: dayNumber, exNumber: exNumber },
  });
}
function deleteDay(dayNumber) {
  store.dispatch("deleteDay", { dayNumber: dayNumber });
}
function addDay() {
  store.dispatch("addDay");
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
  if (dayNumber !== undefined) {
    dayNumberInSpotlight.value = dayNumber;
  }
  if (state !== undefined) {
    alertOpen.value = state;
    return;
  } else {
    alertOpen.value = !alertOpen.value;
  }
}
function togglePicker(state, dayNumber) {
  if (dayNumber !== undefined) {
    dayNumberInSpotlight.value = dayNumber;
  }
  if (state !== undefined) {
    pickerOpen.value = state;
    return;
  } else {
    pickerOpen.value = !alertOpen.value;
  }
}

onMounted(() => {
  store.dispatch("loadLocalData");
});
</script>

<style scoped>
</style>


// 1. Цифры не вводятся с клавиатуры
// 2. Сдедать изменение цифр по лонг тапу
// 3. Сделать импорт-экспорт расписания
// 4. Переделать базу на сервере, добавить таймстемпы
// 5. Доделать синхронизацию
// 6 Исправить ошибку NaN после ввода текста в инпут