module.exports = (sequelize, Sequelize) => {

    const tbl_bigtainer_element = sequelize.define("bilbotainer_elemento", {
        id:  {
            type: Sequelize.INTEGER,   primaryKey: true
        }, 
  modulo_id: {
            type: Sequelize.INTEGER
        }, cliente_id: {
            type: Sequelize.INTEGER
        }, dispositivo_id: {
            type: Sequelize.INTEGER
        },
  codigo:  {
            type: Sequelize.STRING
        }, 
  matricula :  {
            type: Sequelize.STRING
        },
  barras :  {
            type: Sequelize.STRING
        },
  rfid :  {
            type: Sequelize.STRING
        },
        
  color_tapa :  {
            type: Sequelize.STRING
        },color_cuerpo :  {
            type: Sequelize.STRING
        },propietario :  {
            type: Sequelize.STRING
        },obs_maquina :  {
            type: Sequelize.STRING
        }, explotador :  {
            type: Sequelize.STRING
        },fecha_inicio :  {
            type: Sequelize.STRING
        },fecha_final :  {
            type: Sequelize.STRING
        },obs_explotacion :  {
            type: Sequelize.STRING
        },latitud :  {
            type: Sequelize.STRING
        },longitud :  {
            type: Sequelize.STRING
        },
       poblacion :  {
            type: Sequelize.STRING
        },
        calle :  {
            type: Sequelize.STRING
        },numero :  {
            type: Sequelize.STRING
        },obs_ubicacion :  {
            type: Sequelize.STRING
        },foto_entorno :  {
            type: Sequelize.STRING
        },foto_detalle :  {
            type: Sequelize.STRING
        },hora_estado :  {
            type: Sequelize.STRING
        },capacidad :  {
            type: Sequelize.INTEGER
        },cantidad :  {
            type: Sequelize.INTEGER
        },lleno :  {
            type: Sequelize.STRING
        },estado :  {
            type: Sequelize.STRING
        },activo :  {
            type: Sequelize.STRING
        },diurno_inicio :  {
            type: Sequelize.STRING
        },diurno_final :  {
            type: Sequelize.STRING
        },tiempo_diurno_off :  {
            type: Sequelize.STRING
        },tiempo_nocturno_off :  {
            type: Sequelize.STRING
        },tiempo_diurno_on :  {
            type: Sequelize.STRING
        },tiempo_nocturno_on :  {
            type: Sequelize.STRING
        },Coords :  {
            type: Sequelize.STRING
        },punto :  {
            type: Sequelize.STRING
        },llenado :  {
            type: Sequelize.STRING
        },indicador :  {
            type: Sequelize.STRING
        },servicio :  {
            type: Sequelize.STRING
        },alarma :  {
            type: Sequelize.STRING
        },alarma_evento :  {
            type: Sequelize.STRING
        },marcador_1 :  {
            type: Sequelize.STRING
        },marcador_2 :  {
            type: Sequelize.STRING
        },marcador_3 :  {
            type: Sequelize.STRING
        },marcador_4 :  {
            type: Sequelize.STRING
        },marcador_5 :  {
            type: Sequelize.STRING
        },marcador_6 :  {
            type: Sequelize.STRING
        },marcador_7 :  {
            type: Sequelize.STRING
        },compactador_fab :  {
            type: Sequelize.STRING
        },compactador_cod :  {
            type: Sequelize.STRING
        },compactador_sig1 :  {
            type: Sequelize.STRING
        },compactador_sig2 :  {
            type: Sequelize.STRING
        },compactador_prensa1 :  {
            type: Sequelize.STRING
        },compactador_prensa2 :  {
            type: Sequelize.STRING
        },compactador_horas :  {
            type: Sequelize.STRING
        },compactador_alarmas :  {
            type: Sequelize.STRING
        },sin_compactador :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_00 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_01 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_02 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_03 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_04 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_05 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_06 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_07 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_08 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_09 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_10 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_11 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_12 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_13 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_14 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_15 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_16 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_17 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_18 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_19 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_20 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_21 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_22 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_23 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_24 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_25 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_26 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_27 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_28 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_29 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_30 :  {
            type: Sequelize.STRING
        },elemento_hora_alerta_31 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_00 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_01 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_02 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_03 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_04 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_05 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_06 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_07 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_08 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_09 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_10 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_11 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_12 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_13 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_14 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_15 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_16 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_17 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_18 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_19 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_20 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_21 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_22 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_23 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_24 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_25 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_26 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_27 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_28 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_29 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_30 :  {
            type: Sequelize.STRING
        },compactador_hora_alerta_31 :  {
            type: Sequelize.STRING
        },version :  {
            type: Sequelize.STRING
        }}
  );
    return tbl_bigtainer_element;
};