<script>
import { ref, computed } from "vue";
import { useTemporizadorStore } from "../stores/countdown.js";

export default {
    setup() {
        const temporizadorStore = useTemporizadorStore();
        const temporizadorActivo = ref(1); // Estado reactivo para rastrear el temporizador activo

        // Computed properties para los temporizadores
        const temporizador1 = computed(() => formatTiempo(temporizadorStore.temporizadores[0]));
        const temporizador2 = computed(() => formatTiempo(temporizadorStore.temporizadores[1]));

        // Función para formatear minutos y segundos a 2 dígitos
        const formatTiempo = (temporizador) => {
            const minutos = String(temporizador.minutos).padStart(2, '0');
            const segundos = String(temporizador.segundos).padStart(2, '0');
            return `${minutos}:${segundos}`;
        };

        // Funciones para validar los minutos y segundos de cada temporizador
        const validarMinutos = (temporizadorId) => {
            const minutosInput = document.getElementById(
                `minutos${temporizadorId}`
            ).value;
            if (minutosInput === "" || minutosInput < 0) {
                document.getElementById(`minutos${temporizadorId}`).value = 0;
            } else if (minutosInput > 59) {
                document.getElementById(`minutos${temporizadorId}`).value = 59;
            }
        };
        const validarSegundos = (temporizadorId) => {
            const segundosInput = document.getElementById(
                `segundos${temporizadorId}`
            ).value;
            if (segundosInput === "" || segundosInput < 0) {
                document.getElementById(`segundos${temporizadorId}`).value = 0;
            } else if (segundosInput > 59) {
                document.getElementById(`segundos${temporizadorId}`).value = 59;
            }
        };

        const iniciarTemporizador = (temporizadorId) => {
            if (document.getElementById(`segundos${temporizadorId}`).value === "") {
                document.getElementById(`segundos${temporizadorId}`).value = '0';
                return
            }
            const minutosTemporizador = parseInt(
                document.getElementById(`minutos${temporizadorId}`).value
            );
            const segundosTemporizador = parseInt(
                document.getElementById(`segundos${temporizadorId}`).value
            );
            temporizadorStore.iniciar(
                temporizadorId,
                minutosTemporizador,
                segundosTemporizador
            );
            temporizadorActivo.value = temporizadorId; // Actualizar el temporizador activo

            const siguienteTemporizadorId = temporizadorId === 1 ? 2 : 1;

            const intervaloEspera = setInterval(() => {
                const temporizador =
                    temporizadorStore.temporizadores[temporizadorId - 1];
                if (temporizador.estado === "detenido") {
                    clearInterval(intervaloEspera);
                    iniciarTemporizador(siguienteTemporizadorId);
                }
            }, 1000);
        };

        const pausarTemporizador = (temporizadorId) => {
            temporizadorStore.pausar(temporizadorId);
        };
        const reiniciarTemporizador = (temporizadorId) => {
            if (document.getElementById(`segundos${temporizadorId}`).value === "") {
                document.getElementById(`segundos${temporizadorId}`).value = '0';
                return
            }
            const minutosTemporizador = parseInt(
                document.getElementById(`minutos${temporizadorId}`).value
            );
            const segundosTemporizador = parseInt(
                document.getElementById(`segundos${temporizadorId}`).value
            );

            temporizadorStore.iniciar(
                temporizadorId,
                minutosTemporizador,
                segundosTemporizador
            );
            temporizadorActivo.value = temporizadorId; // Actualizar el temporizador activo

            const siguienteTemporizadorId = temporizadorId === 1 ? 2 : 1;

            const intervaloEspera = setInterval(() => {
                const temporizador =
                    temporizadorStore.temporizadores[temporizadorId - 1];
                if (temporizador.estado === "detenido") {
                    clearInterval(intervaloEspera);
                    iniciarTemporizador(siguienteTemporizadorId);
                }
            }, 1000);
        };

        return {
            temporizadorStore,
            temporizador1,
            temporizador2,
            temporizadorActivo,
            validarMinutos,
            validarSegundos,
            iniciarTemporizador,
            pausarTemporizador,
            reiniciarTemporizador,
        };
    },
};
</script>

<template>
    <div class="configuracionAlarma">
        <h1 class="titulo">Alarma Vue+Vite</h1>

        <div class="divTiempoLabel">
            <div class="labelInput">
                <label for="minutos1" class="label">Temporizador 1</label>
                <input type="number" id="minutos1" placeholder="Minutos" min="0" max="59"
                    @input="validarMinutos(1)" />
                <input type="number" id="segundos1" placeholder="Segundos" min="0" max="59"
                    @input="validarSegundos(1)" />
            </div>
            <div class="labelInput">
                <label for="minutos2" class="label">Temporizador 2</label>
                <input type="number" id="minutos2" placeholder="Minutos" min="0" max="59"
                    @input="validarMinutos(2)" />
                <input type="number" id="segundos2" placeholder="Segundos" min="0" max="59"
                    @input="validarSegundos(2)" />
            </div>
        </div>

        <div class="botones">
            <button @click="iniciarTemporizador(temporizadorActivo)" class="btn btn-iniciar">
                INICIAR
            </button>
            <button v-if="
                temporizadorStore.temporizadores[temporizadorActivo - 1].estado ===
                'iniciado'
            " @click="pausarTemporizador(temporizadorActivo)" class="btn btn-pausar" :disabled="true">
                PAUSAR
            </button>

            <button v-if="
                temporizadorStore.temporizadores[temporizadorActivo - 1].estado ===
                'pausado'
            " @click="pausarTemporizador(temporizadorActivo)" class="btn btn-pausar">
                REANUDAR
            </button>
            <button @click="reiniciarTemporizador(temporizadorActivo)" class="btn btn-reiniciar">
                REINICIAR
            </button>
        </div>
    </div>
    <div class="tiempoAlarma">
        <h1 class="tiempo" v-if="temporizadorActivo === 1">
            {{ temporizador1 }}
        </h1>
        <h1 class="tiempo" v-else>
            {{ temporizador2 }}
        </h1>
    </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
@import url("https://fonts.cdnfonts.com/css/inter");
@import url("https://fonts.cdnfonts.com/css/digital-numbers");

.titulo {
    font-family: "IBM Plex Mono";
    font-size: 48px;
    color: #ffffff;
}

.configuracionAlarma {
    background-color: #1c1c1c;
    width: auto;
    height: 50vh;
    padding: 20px;
    text-align: center;
}

.divTiempoLabel {
    display: flex;
    /* Activar Flexbox */
    justify-content: center;
    /* Centrar verticalmente */
    gap: 70px;
}

.divTiempoLabel div:nth-child(1) {
    text-align: left;
}

.divTiempoLabel div:nth-child(2) {
    text-align: right;
}

.labelInput {
    padding-bottom: 50px;
}

.labelInput label {
    font-family: Inter;
    font-weight: 400;
    font-size: 36px;
    line-height: 4.166666666666667;
    color: #ffffff;
}

.labelInput input {
    display: flex;
    width: 685px;
    height: 61px;
    gap: 8px;
    background-color: #ffffff;
    padding: 12px 16px;
    border-radius: 8px;
    border-width: 1px;
    border-style: solid;
    border-color: #e0e0e0;
    box-shadow: 0px 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* Estilos base del botón */
.botones {
    display: flex;
    justify-content: center;
}

.btn {
    display: inline-block;
    margin: 0 8px;
    width: 180px;
    height: 50px;
    font-weight: 400;
    color: #fff;
    font-family: Roboto;
    font-size: 20px;
    border-radius: 6px;
}

.btn-iniciar {
    background-color: #1e6a6e;
}

.btn-pausar {
    background-color: #c88430;
}

.btn-reiniciar {
    background-color: #dd2e41;
}

/* Estilos del tiempo */
.tiempoAlarma {
    display: flex;
    background-color: #080808;
    justify-content: center;
    align-items: center;
    width: auto;
    height: 50vh;
    border-radius: 5px;
}

.tiempo {
    font-family: "Digital Numbers";
    font-weight: 400;
    font-size: 200px;
    letter-spacing: -25px;
    color: #ff0303;
}
</style>
