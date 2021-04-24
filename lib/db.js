let mysql =require('mysql');
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: "nodejs_crud_db"
})

connection.connect((error) =>{
    if (!!error) {
        console.log(error);
    } else{
        console.log('Connected...')
    }
})

module.exports = connection;