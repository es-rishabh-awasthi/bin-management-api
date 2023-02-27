module.exports = (sequelize, Sequelize) => {
    const tbl_sidetainer_element = sequelize.define("sidetainer_elemento", {
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
        },explotador :  {
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
        },poblacion :  {
            type: Sequelize.STRING
        },calle :  {
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
        },estado_buzon :  {
            type: Sequelize.STRING
        },indicador_buzon :  {
            type: Sequelize.STRING
        }}
  );
    return tbl_sidetainer_element;
};