var bcrypt = require("bcrypt-nodejs");

var demoPassword = bcrypt.hashSync("demo123", bcrypt.genSaltSync(5), null);

var users = [
  {
    id: "demo-1",
    _id: "demo-1",
    email: "demo@demo.com",
    password: demoPassword,
    encryptPassword: function(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
    },
    vaildPassword: function(password) {
      return bcrypt.compareSync(password, this.password);
    },
    save: function(callback) {
      users.push(this);
      callback(null, this);
    }
  }
];

function findOne(query, callback) {
  var user = users.find(function(u) {
    return u.email === query.email;
  });
  callback(null, user);
}

function findById(id, callback) {
  var user = users.find(function(u) {
    return u.id === id || u._id === id;
  });
  callback(null, user);
}

function createUser(email, password) {
  var user = {
    id: "user-" + (users.length + 1),
    _id: "user-" + (users.length + 1),
    email: email,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(5), null),
    encryptPassword: function(pwd) {
      return bcrypt.hashSync(pwd, bcrypt.genSaltSync(5), null);
    },
    vaildPassword: function(pwd) {
      return bcrypt.compareSync(pwd, this.password);
    },
    save: function(callback) {
      users.push(this);
      callback(null, this);
    }
  };
  return user;
}

module.exports = { findOne, findById, createUser };
