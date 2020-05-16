const { body } = require('express-validator')

exports.validate = (method) => {
  switch (method) {
    case 'createUser': {
     return [ 
        body('email', 'Invalid email').exists().isEmail(),
       ]   
    }
  }
}