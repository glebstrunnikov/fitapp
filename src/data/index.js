import { createStore } from "vuex";
import exercisesDummy from "./exercises.json";
import { Preferences } from "@capacitor/preferences";
import dummy from "./dummy.json";
const DB_ENDPOINT = "https://glebstrunnikov.com/gym";
// const DB_ENDPOINT = "http://localhost:3000";
async function setSchedule(data) {
  console.log(data);

  await Preferences.set({
    key: "schedule",
    value: JSON.stringify(data.schedule),
  });

  fetch(DB_ENDPOINT + "/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
async function getExes() {
  // const now = new Date().getTime()
  try {
    const res = await fetch(DB_ENDPOINT + "/ex-list", {
      method: "GET",
      headers: { "content-type": "application/json" },
    });
    const exList = await res.json();

    await Preferences.set({
      key: "exes",
      value: JSON.stringify(exList[0]),
    });

    return exList[0];
  } catch {
    console.log("connection error - exes");
    const exes = await Preferences.get({ key: "exes" });
    const result = exes.value ? JSON.parse(exes.value) : null;
    return result;
  }
}

async function getSchedule(userId) {
  const pref = await Preferences.get({ key: "schedule" });
  const time = await Preferences.get({ key: "time" });

  const localData = pref.value ? JSON.parse(pref.value) : null;
  const localTime = time.value ? JSON.parse(time.value) : null;
  try {
    console.log(userId);
    const response = await fetch(DB_ENDPOINT + "?id=" + userId, {
      method: "GET",
      headers: { "content-type": "application/json" },
    });
    console.log("privet2");
    const webResponse = response ? await response.json() : null;
    const webData = JSON.parse(webResponse[0][0].user_data).days;
    console.log(webData);
    if (!localData || !localTime) {
      return webData;
    } else {
      if (localTime > webData.user_time) {
        return localData;
      } else if (localData.time < webData.user_time) {
        return webData;
      }
    }
  } catch {
    console.log("connection error");
    if (localData) {
      return localData;
    } else {
      return dummy;
    }
  }
}

const store = createStore({
  state() {
    return {
      schedule: [
        [
          {
            exId: 1,
            sets: 3,
            times: 12,
            weight: "0",
            comment: "",
          },
          {
            exId: 2,
            sets: 3,
            times: 12,
            weight: "0",
            comment: "",
          },
          {
            exId: 3,
            sets: 3,
            times: 12,
            weight: "0",
            comment: "",
          },
          {
            exId: 4,
            sets: 3,
            times: 12,
            weight: "0",
            comment: "",
          },
          {
            exId: 5,
            sets: 3,
            times: 12,
            weight: "0",
            comment: "",
          },
          {
            exId: 6,
            sets: 3,
            times: 12,
            weight: "0",
            comment: "",
          },
          {
            exId: 7,
            sets: 3,
            times: 12,
            weight: "0",
            comment: "",
          },
        ],
        [
          {
            exId: 8,
            sets: 3,
            times: 12,
            weight: "0",
            comment: "",
          },
          {
            exId: 9,
            sets: 3,
            times: 12,
            weight: "0",
            comment: "",
          },
        ],
        [
          {
            exId: 8,
            sets: 3,
            times: 12,
            weight: "0",
            comment: "",
          },
        ],
        [
          {
            exId: 8,
            sets: 3,
            times: 12,
            weight: "0",
            comment: "",
          },
        ],
        [
          {
            exId: 8,
            sets: 3,
            times: 12,
            weight: "0",
            comment: "",
          },
        ],
      ],
      // exercises: exercisesDummy,
      exercises: [],
      // userId: 210594077,
      userId: null,
      editMode: false,
      modalOpen: false,
      exInQuestion: { exId: 0, sets: 0, times: 0, weight: "0", comment: "" },
      time: 0,
    };
  },
  getters: {
    exercises(state) {
      return state.exercises;
    },
    schedule(state) {
      return state.schedule;
    },
    userId(state) {
      return state.userId;
    },

    data(state) {
      const result = state.schedule;
      console.log(state.schedule);
      if (state.schedule) {
        state.schedule.forEach((day, dayNumber) => {
          day.forEach((ex, exNumber) => {
            const exName = state.exercises.filter((exFromList) => {
              return exFromList.base_ex_id === ex.base_ex_id;
            });
            if (exName.length) {
              result[dayNumber][exNumber].name = exName[0].name;
              // result[dayNumber][exNumber].video = exName[0].video;
            }
          });
        });
      }
      return result;
    },

    editMode(state) {
      return state.editMode;
    },
    modalOpen(state) {
      return state.modalOpen;
    },
    exInQuestion(state) {
      return state.exInQuestion;
    },
  },
  mutations: {
    async loadLocalData(state) {
      state.schedule = await getSchedule(state.userId);
      state.exercises = await getExes();
    },
    toggleEditMode(state) {
      state.editMode = !state.editMode;
    },
    deleteEx(state, exCode) {
      state.schedule[exCode.payload.dayNumber].splice(
        exCode.payload.exNumber,
        1
      );
      state.time = new Date().getTime();
      setSchedule(state);
    },
    deleteDay(state, payload) {
      state.schedule.splice(payload.dayNumber, 1);
      state.time = new Date().getTime();
      setSchedule(state);
    },
    addDay(state) {
      state.schedule.push([]);
      state.time = new Date().getTime();
      setSchedule(state);
    },
    toggleModal(state) {
      state.modalOpen = !state.modalOpen;
    },
    setExInQuestion(state, payload) {
      //   if (payload.exId) {
      //     state.exInQuestion.exId = payload.exId;
      //   }
      if (payload.sets) {
        state.exInQuestion.sets = payload.sets;
      }
      if (payload.times) {
        state.exInQuestion.times = payload.times;
      }
      if (payload.weight) {
        state.exInQuestion.weight = payload.weight;
      }
      if (payload.comment) {
        state.exInQuestion.comment = payload.comment;
      }
      state.time = new Date().getTime();
      // setSchedule(state);
    },
    saveExData(state, payload) {
      console.log(payload);
      state.schedule[payload.dayNumber][payload.exNumber].sets = payload.sets;
      state.schedule[payload.dayNumber][payload.exNumber].times = payload.times;
      state.schedule[payload.dayNumber][payload.exNumber].weight =
        payload.weight;
      state.schedule[payload.dayNumber][payload.exNumber].comment =
        payload.comment;
      console.log(state.schedule[payload.dayNumber][payload.exNumber]);
      state.time = new Date().getTime();
      setSchedule(state);
      console.log(state.schedule[payload.dayNumber][payload.exNumber]);
    },
    addEx(state, payload) {
      state.schedule[payload.dayNumber].push({
        exId: payload.exId,
        sets: 3,
        times: 12,
        weight: "0",
        comment: "",
      });
      state.time = new Date().getTime();
      setSchedule(state);
    },
    // updateTime(state, payload) {
    //   if (payload) {
    //     state.time = payload;
    //   } else state.time = new Date().getTime();
    // },
    setUserId(state, payload) {
      console.log(payload);
      Preferences.set({
        key: "userId",
        value: JSON.stringify(payload),
      });
      state.userId = payload;
      getExes();
      getSchedule(payload);
    },
  },
  actions: {
    loadLocalData(context) {
      context.commit("loadLocalData");
    },
    deleteEx(context, payload) {
      context.commit("deleteEx", payload);
    },
    deleteDay(context, payload) {
      context.commit("deleteDay", payload);
    },
    addDay(context) {
      context.commit("addDay");
    },
    toggleEditMode(context) {
      context.commit("toggleEditMode");
    },
    toggleModal(context) {
      context.commit("toggleModal");
    },
    setExInQuestion(context, payload) {
      context.commit("setExInQuestion", payload);
    },
    saveExData(context, payload) {
      context.commit("saveExData", payload);
    },
    addEx(context, payload) {
      context.commit("addEx", payload);
    },
    // updateTime(context, payload) {
    //   context.commit("updateTime", payload);
    // },
    setUserId(content, payload) {
      content.commit("setUserId", payload);
    },
  },
});

export default store;
