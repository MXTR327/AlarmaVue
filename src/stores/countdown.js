import { defineStore } from "pinia";
import { computed } from "vue";

const audio = new Audio("/media/Alarm_Clock.mp3");

export const useTemporizadorStore = defineStore("temporizador", {
  state: () => ({
    temporizadorActivo: 1,
    temporizadores: [
      {
        minutos: 0,
        segundos: 0,
        intervalo: null,
        estado: "detenido",
      },
      {
        minutos: 0,
        segundos: 0,
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

        const formatTiempo = (temporizador) => {
          const minutos = String(temporizador.minutos).padStart(2, "0");
          const segundos = String(temporizador.segundos).padStart(2, "0");
          return `${minutos}:${segundos}`;
        };

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

          const temporizadorFormateado = computed(() =>
            formatTiempo(this.temporizadores[temporizadorId - 1])
          );
          document.title = "Alarma: " + temporizadorFormateado.value;
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
    reiniciar(temporizadorId, minutos, segundos) {
      const temporizador = this.temporizadores[temporizadorId - 1];
      clearInterval(temporizador.intervalo);
      temporizador.estado = "detenido";
      this.iniciar(temporizadorId, minutos, segundos);
    },
  },
});
