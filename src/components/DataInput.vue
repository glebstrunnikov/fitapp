<template>
  <ion-list>
    <ion-item>
      <ion-input :value="inputValue" label-placement="stacked" :label="label">
        <ion-button
          @click="adjust('minus')"
          fill="clear"
          slot="start"
          aria-label="Show/hide"
        >
          <ion-icon
            slot="icon-only"
            :icon="remove"
            aria-hidden="true"
          ></ion-icon>
        </ion-button>

        <ion-button
          @click="adjust('plus')"
          fill="clear"
          slot="end"
          aria-label="Show/hide"
        >
          <ion-icon slot="icon-only" :icon="add" aria-hidden="true"></ion-icon>
        </ion-button>
      </ion-input>
    </ion-item>
  </ion-list>
</template>

<script setup>
import { IonButton, IonIcon, IonInput, IonItem, IonList } from "@ionic/vue";
import { add, remove } from "ionicons/icons";
import { defineProps, ref } from "vue";
import { useStore } from "vuex";
const props = defineProps(["label", "initialValue", "type"]);
const store = useStore();
const inputValue = ref(props.initialValue);
function adjust(sign) {
  if (props.type === "weight" && typeof inputValue.value === String) {
    inputValue.value = inputValue.value.replaceAll(/($\d+).*^/g, /$1/);
    inputValue.value = Number(inputValue.value);
  }

  sign === "plus"
    ? (inputValue.value = Number(inputValue.value) + 1)
    : (inputValue.value = Number(inputValue.value) - 1);

  store.dispatch("setExInQuestion", { [props.type]: inputValue.value });
}
</script>