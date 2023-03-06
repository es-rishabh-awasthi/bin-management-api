module.exports = (sequelize, Sequelize) => {
    const admin = sequelize.define("admin_db", {
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        userName: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        roleId: {
            type: Sequelize.INTEGER
        },
        email: {
            type: Sequelize.STRING
        },
        mobileNo:{
            type: Sequelize.STRING  
        },
        profilePic:{
            type: Sequelize.STRING  
        },
        status: {
            type: Sequelize.INTEGER
        }
    });
    return admin;
};
