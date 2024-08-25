import { createSlice } from "@reduxjs/toolkit";
import { store } from "./store";

let socket = null;

const connectSocket = (dispatch, url) => {
  socket = new WebSocket(url);

  socket.onopen = () => {
    store.dispatch(open());
    store.dispatch(updateSocket())
  };

  socket.onerror = () => {
    store.dispatch(error());
  };

  socket.onclose = () => {
    store.dispatch(closed());
  };
};

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    status: "DISCONNECTED",
    attemptCount: 0,
    groups: {},
    privates: {},
    socket: {}
  },
  reducers: {
    connect(state, action) {
      if (socket !== null) {
        socket.close();
      }

      connectSocket(store.dispatch, action.payload);
      state.status = "CONNECTING";
    },

    open(state) {
      state.status = "OPEN";
      state.attemptCount = 0;
    },

    updateSocket(state) {
      state.socket = socket;
    },

    error(state) {
      state.status = "ERROR";
      // Attempt to reconnect after 5 seconds
      // if (state.attemptCount < 5) {
      //   setTimeout(() => {
      //     state.attemptCount++;
      //     state.status = "CONNECTING";
      //     connectSocket(store.dispatch, action.payload);
      //   }, 5000);
      // } else {
      //   state.status = "MAX_ATTEMPTS_REACHED";
      // }
    },

    closed(state) {
      state.status = "CLOSED";
      // Attempt to reconnect after 5 seconds
      // if (state.attemptCount < 5) {
      //   setTimeout(() => {
      //     state.attemptCount++;
      //     state.status = "CONNECTING";
      //     connectSocket(store.dispatch, action.payload);
      //   }, 5000);
      // } else {
      //   state.status = "MAX_ATTEMPTS_REACHED";
      // }
    },

    send(state, action) {
      if (socket !== null && socket.readyState === WebSocket.OPEN) {
        socket.send(action.payload);
      }
    },

    disconnect(state) {
      if (socket !== null) {
        socket.close();
        socket = null;
        state.status = "DISCONNECTED";
        state.attemptCount = 0;
      }
    },

    receiveGroupMessage(state, action) {
      const { groupId, message } = action.payload;
      state.groups[groupId] = [...(state.groups[groupId] || []), message];
    },

    receivePrivateMessage(state, action) {
      const { userId, message } = action.payload;
      state.privates[userId] = [...(state.privates[userId] || []), message];
    },
  },
});

export const {
  connect,
  open,
  error,
  closed,
  send,
  disconnect,
  updateSocket,
  receiveGroupMessage,
  receivePrivateMessage,
} = socketSlice.actions;

export default socketSlice.reducer;
