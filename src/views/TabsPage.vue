<template>
  <ion-page v-if="!userId">
    <ion-card>
      user id:
      {{ userId }}
      <ion-card-content
        ><h4>
          Вы не авторизованы. Пожалуйста, воспользуйтесь телеграм-ботом для
          авторизации в приложении:
          <a href="t.me/gymdailybot">t.me/gymdailybot</a>
        </h4>
        <h4>После авторизации введите свой ID:</h4>
        <ion-input v-model="userIdInput"></ion-input>
        <ion-toolbar
          ><ion-button @click="setUserId" slot="end"
            >Подтвердить</ion-button
          ></ion-toolbar
        >
      </ion-card-content>
    </ion-card>
  </ion-page>

  <ion-page v-if="userId">
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <!-- <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="triangle" />
          <ion-label>Расписание</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="ellipse" />
          <ion-label>Tab 2</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon aria-hidden="true" :icon="square" />
          <ion-label>Tab 3</ion-label>
        </ion-tab-button>
      </ion-tab-bar> -->
    </ion-tabs>
  </ion-page>
</template>

<script setup>
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
  IonInput,
  IonCard,
  IonButton,
  IonToolbar,
} from "@ionic/vue";
import { ellipse, square, triangle } from "ionicons/icons";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { Preferences } from "@capacitor/preferences";
const store = useStore();
const userId = computed(() => {
  return store.getters.userId;
});
const userIdInput = ref(null);
function setUserId() {
  store.dispatch("setUserId", userIdInput.value);
}
onMounted(async () => {
  const userIdRetrieved = await Preferences.get({ key: "userId" });
  if (userIdRetrieved) {
    console.log(JSON.parse(userIdRetrieved.value));
    store.dispatch("setUserId", JSON.parse(userIdRetrieved.value));
  }
});
</script>

<style scoped>
a {
  display: inline;
}
ion-input {
  border-radius: 20px;
  border-style: dotted;
  border-width: 1px;
}
</style>