const config = {
    'host': 'localhost',
    'port': 5432,
    'user': 'postgres',
    'password': '',
    'database': 'expressshop'
}

const pg = require('pg-promise')()
const db = pg(config)

const bcrypt = require('bcrypt')

function wrap(string){
    return '\'' + string + '\''
}

function createTable(tbName, colDescArr){
    return db.any('CREATE TABLE ' + tbName + ' ( ' + colDescArr.join(', ') + ' ) ;')
}

//TODO USE SEPARATE USERDATA TABLE 
function checkDefaultTables(){
    db.any('SELECT * FROM users;')
    .then(after => {
        console.log('> PostgreSQL user table okay.')
    })
    .catch(err => 
        createTable('users', [
            'id SERIAL PRIMARY KEY',
            'username VARCHAR(20) NOT NULL',
            'email VARCHAR(255) NOT NULL',
            'pswd VARCHAR(255) NOT NULL',
        ]).then(after => {
            console.log('> PostgreSQL user table created.')
            db.oneOrNone('SELECT * FROM userdata LIMIT 1;')
    .then(after => {
        console.log('> PostgreSQL userdata table okay.')
    })
    .catch(err =>
        createTable('addresses', [
            'id SERIAL PRIMARY KEY',
            'uid INTEGER REFERENCES users(id) NOT NULL',
            'name VARCHAR(100)',
            'street VARCHAR(100)',
            'city VARCHAR(50)',
            'zip INT',
        ]).then(console.log('> PostgreSQL address table created.')).catch(err => console.log(err)))
        db.oneOrNone('SELECT * FROM orders LIMIT 1;')
            .then(after => {
                console.log('> PostgreSQL orders table okay.')
            })
            .catch(err =>
                createTable('usernetworks', [
                    'id SERIAL PRIMARY KEY',
                    'uid INTEGER REFERENCES users(id) NOT NULL',
                    'productids INTEGER[] DEFAULT \'{}\'',
                ]).then(console.log('> PostgreSQL orders table created.')).catch(err => console.log(err)))
        db.oneOrNone('SELECT * FROM products LIMIT 1;')
            .then(after => {
                console.log('> PostgreSQL notifications table okay.')
            })
            .catch(err =>
                createTable('products', [
                    'id SERIAL PRIMARY KEY',
                    'code INTEGER NOT NULL',
                    'name VARCHAR(50) NOT NULL',
                    'price INTEGER NOT NULL',
                    'details TEXT',
                ]).then(after => {
                    console.log('> PostgreSQL products table created.')
                }).catch(err => console.log(err)))
        }).catch(err => console.log(err)))
    db.oneOrNone('SELECT * FROM session LIMIT 1;')
        .then(after => {
            console.log('> PostgreSQL session table okay.')
        })
        .catch(err =>
            db.any('CREATE TABLE "session" ( "sid" varchar NOT NULL COLLATE "default", "sess" json NOT NULL, "expire" timestamp(6) NOT NULL ) WITH (OIDS=FALSE);')
              .then(db.any('ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;'))
              .then(console.log('> PostgreSQL session table created.')).catch(err => console.log(err)))
}

function insertNewData(tbName,colArr,valArr){
    return db.any('INSERT INTO ' + tbName + '(' + colArr.join(', ') + ')' + ' VALUES ' + ' ( ' + valArr.join(', ') + ' ) ;')
}

function updateData(tbName,colArr,valArr,filColArr,filArr){
    let comm = 'UPDATE ' + tbName + ' SET'
    if(colArr.length == 1){
        comm += ' ' + colArr[0] + ' = ' + valArr[0] + ' '
    }
    else{
        for(let i = 0;i < colArr.length;i++){
            comm += ' ' + colArr[i] + ' = ' + valArr[i]
            if(i < colArr.length - 1){
                comm += ', '
            }
        }
    }
    comm += 'WHERE'
    if(filColArr.length == 1){
        comm += ' ' + filColArr[0] + ' = ' + filArr[0]
    }
    else{
        for(let i = 0;i < filArr.length;i++){
            comm += ' ' + filArr[i] + ' = ' + filArr[i]
            if(i < filArr.length - 1){
                comm += ' AND '
            }
        }
    }
    return db.any(comm + ';')
}

function selectTableAll(tbName){
    return db.any('SELECT * FROM ' + tbName + ';')
}

function filterData(tbName,colArr,filColArr,filArr){
    let comm = 'SELECT '
    if(colArr.length == 1){
        comm += colArr[0]
    }
    else{
        for(let i = 0;i < colArr.length;i++){
            comm += ' ' + colArr[i]
            if(i < colArr.length - 1){
                comm += ', '
            }
        }
    }
    comm += ' FROM ' + tbName
    if(filColArr){
        comm += ' WHERE'
        if(filColArr.length == 1){
            comm += ' ' + filColArr[0] + ' = ' + filArr[0]
        }
        else{
            for(let i = 0;i < filArr.length;i++){
                comm += ' ' + filColArr[i] + ' = ' + filArr[i]
                if(i < filArr.length - 1){
                    comm += ' AND '
                }
            }
        }
    }
    return db.any(comm + ';')
}

function deleteData(tbName,filColArr,filArr){
    let comm = 'DELETE FROM ' + tbName + ' WHERE'
    if(filColArr.length == 1){
        comm += ' ' + filColArr[0] + ' = ' + filArr[0]
    }
    else{
        for(let i = 0;i < filArr.length;i++){
            comm += ' ' + filColArr[i] + ' = ' + filArr[i]
            if(i < filArr.length - 1){
                comm += ' AND '
            }
        }
    }
    return db.any(comm + ';')
}

checkDefaultTables()

exports.encryptPassword = (pswd) => bcrypt.hash(pswd, 5)
exports.comparePasswords = (givenPswd,dbPswd) => bcrypt.compare(givenPswd, dbPswd)

exports.wrap = (string) => wrap(string)

exports.createTable = (tbName, colDescArr) => createTable(tbName, colDescArr)
exports.insertNewData = (tbName,colArr,valArr) => insertNewData(tbName,colArr,valArr)
exports.updateData = (tbName,colArr,valArr,filColArr,filArr) => updateData(tbName,colArr,valArr,filColArr,filArr)
exports.selectTableAll = (tbName) => selectTableAll(tbName)
exports.filterData = (tbName,colArr,filColArr,filArr) => filterData(tbName,colArr,filColArr,filArr)
exports.deleteData = (tbName,filColArr,filArr) => deleteData(tbName,filColArr,filArr)

exports.one = (query) => db.one(query)
exports.any = (query) => db.any(query)
exports.none = (query) => db.none(query)
exports.oneOrNone = (query) => db.oneOrNone(query)