// src/context/SwipeControl.js
let swipeHabilitado = true;

export const getSwipe = () => swipeHabilitado;
export const setSwipe = (value) => {
  swipeHabilitado = value;
};
