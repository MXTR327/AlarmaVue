import { defineStore } from "pinia";
const audio = new Audio("/media/Alarm_Clock.mp3");

export const useTemporizadorStore = defineStore("temporizador", {
  state: () => ({
    temporizadorActivo: 1,
    temporizadores: [
      {
        minutos: "00",
        segundos: "00",
        intervalo: null,
        estado: "detenido",
      },
      {
        minutos: "00",
        segundos: "00",
        intervalo: null,
        estado: "detenido",
      },
    ],
  }),
  actions: {
    iniciar(temporizadorId, minutos, segundos) {
      const temporizador = this.temporizadores[temporizadorId - 1];

      minutos = isNaN(minutos) ? 0 : Math.max(0, Math.min(59, minutos));
      segundos = isNaN(segundos) ? 0 : Math.max(0, Math.min(59, segundos));

      temporizador.minutos = minutos;
      temporizador.segundos = segundos;

      if (temporizador.estado !== "iniciado") {
        temporizador.estado = "iniciado";
        temporizador.intervalo = setInterval(() => {
          if (temporizador.segundos === 0 && temporizador.minutos === 0) {
            clearInterval(temporizador.intervalo);
            temporizador.estado = "detenido";
            audio.play();
          } else if (temporizador.segundos === 0) {
            temporizador.minutos--;
            temporizador.segundos = 59;
          } else {
            temporizador.segundos--;
          }
        }, 1000);
      }
    },
    pausar(temporizadorId) {
      const temporizador = this.temporizadores[temporizadorId - 1];
      const minutos = temporizador.minutos;
      const segundos = temporizador.segundos;

      if (temporizador.estado !== "pausado") {
        clearInterval(temporizador.intervalo);
        temporizador.estado = "pausado";
      } else {
        this.iniciar(temporizadorId, minutos, segundos);
      }
    },
    reiniciar(temporizadorId) {
      const temporizador = this.temporizadores[temporizadorId - 1];
      this.iniciar(temporizadorId, temporizador.minutos, temporizador.segundos);
    },
  },
});
