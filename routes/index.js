let express = require('express');
let router = express.Router();
let path = require("path")
// let sql = require("../modules/sqlCom")
let utils = require('../modules/utils')
let db = require("../modules/pgutils")

//change to having dashboard button instead of log/reg forms , no redirect
router.get('/', (req, res, next) => {
  const uid = req.session.uid
  if(uid){
    res.redirect('/dashboard')
    return
  }
  res.render('index')
})

router.post('/register', (req,res,next) => {
  let valid = true
  let blame
  const username = req.body.regUsername
  const email = req.body.regEmail
  const pswd = db.encryptPassword(req.body.regPswd).then(pswdHash => {
    db.any('SELECT username, email  FROM users WHERE username = ' + db.wrap(username) + ' OR email = ' + db.wrap(email) + ' ;')
      .then(rows => {
        if(rows.length > 0){
           rows.forEach(row => {
             if(row.username == username){
               res.render('index',{'regBlame': 'Username is not available'})
               return
             }
             else if(row.email == email){
               res.render('index',{'regBlame': 'Email already in use.'})
               return
             }
           })
        }
        else{
          db.insertNewData('users',['username','email','pswd'],[
            db.wrap(username),
            db.wrap(email),
            db.wrap(pswdHash)
          ])
            .then(result =>{
              db.one('SELECT * FROM users WHERE username = ' + db.wrap(username) + ';')
                .then(userrow => {
                    db.insertNewData('userdata',['uid','username'],[userrow.id,db.wrap(username)])
                    const sess = req.session
                    sess.uid = userrow.id
                    sess.username = userrow.username
                    res.redirect('/dashboard')
              }).catch(err => console.log(err))
         })
      }
    })
  })
})

router.post('/login',(req,res,next) => {
  const username = req.body.logUsername
  const pswd = req.body.logPswd
  let user
  db.selectTableAll('users').then(userTableRows => {
     userTableRows.forEach(row => {
       if(username == row.username){
          user = row
       }
     })
     if(!user){
      res.render('index',{logBlame: 'Sorry, that username does not exist.'})
     }
     else{
       db.comparePasswords(pswd,user.pswd).then(isMatch => {
          if(isMatch){
            const sess = req.session
            sess.uid = user.id
            sess.username = user.username
            res.redirect('/dashboard')
          }
          else{
            res.render('index',{logBlame: 'Sorry, incorrect password.'})
          }
        }
      )}
  })
})

router.post('/logout',(req,res,next) => {
    req.session.destroy()
    res.redirect('../')
})

router.get('/logout',(req,res,next) => {
  req.session.destroy()
  res.redirect('../')
})

router.get('/register',(req,res,next) => {
  res.redirect('/')
})
router.get('/login',(req,res,next) => {
  res.redirect('/')
})

module.exports = router;