import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      exercises: [
        {
          id: 1,
          name: "Разгибание ног",
          comment: "",
          video: "",
        },
        {
          id: 2,
          name: "Гиперэкстензия",
          comment: "",
          video: "",
        },
        {
          id: 3,
          name: "Подтягивания в гравитоне широким хватом",
          comment: "",
          video: "",
        },
        {
          id: 4,
          name: "Жим штанги лежа",
          comment: "",
          video: "",
        },
        {
          id: 5,
          name: "Разгибание рук в вертикальном блоке",
          comment: "",
          video: "",
        },
        {
          id: 6,
          name: "Подъем штанги к подбородку",
          comment: "aka протяжка. Локти не поднимаются выше плеч",
          video: "",
        },
        {
          id: 7,
          name: "Подъем ног в висе",
          comment: "",
          video: "",
        },
        {
          id: 8,
          name: "Жим ногами",
          comment: "",
          video: "",
        },
      ],
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
      editMode: false,
      modalOpen: false,
      exInQuestion: { exId: 0, sets: 0, times: 0, weight: "0", comment: "" },
    };
  },
  getters: {
    exercises(state) {
      return state.exercises;
    },
    schedule(state) {
      return state.schedule;
    },

    data(state) {
      const result = state.schedule;
      state.schedule.forEach((day, dayNumber) => {
        day.forEach((ex, exNumber) => {
          const exName = state.exercises.filter((exFromList) => {
            return exFromList.id === ex.exId;
          });
          result[dayNumber][exNumber].name = exName[0].name;
        });
      });
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
    toggleEditMode(state) {
      state.editMode = !state.editMode;
    },
    deleteEx(state, exCode) {
      state.schedule[exCode.payload.dayNumber].splice(
        exCode.payload.exNumber,
        1
      );
    },
    deleteDay(state, payload) {
      state.schedule.splice(payload.dayNumber, 1);
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
    },
    saveExData(state, payload) {
      state.schedule[payload.dayNumber][payload.exNumber].sets = payload.sets;
      state.schedule[payload.dayNumber][payload.exNumber].times = payload.times;
      state.schedule[payload.dayNumber][payload.exNumber].weight =
        payload.weight;
      state.schedule[payload.dayNumber][payload.exNumber].comment =
        payload.comment;
    },
    addEx(state, payload) {
      console.log(payload);
      state.schedule[payload.dayNumber].push({
        exId: payload.exId,
        sets: 3,
        times: 12,
        weight: "0",
        comment: "",
      });
    },
  },
  actions: {
    deleteEx(context, payload) {
      context.commit("deleteEx", payload);
    },
    deleteDay(context, payload) {
      context.commit("deleteDay", payload);
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
  },
});

export default store;
