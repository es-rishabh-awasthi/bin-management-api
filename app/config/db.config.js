module.exports = {
    // HOST: "localhost",
    // USER: "root",
    // PASSWORD: "",
    // DB: "modbus",
    HOST: "db-egen-instance-1.cjcbvecb5ydf.us-east-1.rds.amazonaws.com",
    USER: "admin",
    PASSWORD: "adminnimda",
    DB: "modbus",
    dialect: "mysql",
    logging:false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};