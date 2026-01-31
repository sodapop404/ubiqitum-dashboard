// state.js

let dashboardState = null;

function setState(data) {
  dashboardState = data;
}

function getState() {
  return dashboardState;
}

export const state = {
  setState,
  getState
};

