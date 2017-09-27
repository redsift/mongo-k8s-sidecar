var mongo = require('./mongo');

var createUserOnce = function createUserOnce(db, password, done) {
    var calledOnce = false
    return  function createUser(db, password, done) {
        console.log('datadog.createUserOnce',calledOnce);
        if (calledOnce) {
            return done();
        }

        if (!password) {
            return done(new Error('no password provided'));
        }

        admin = db.admin();

        admin.addUser('datadog', password, {roles: ['read', 'clusterMonitor']}, function(err, result){
            if (err) {
                if (!(err.name === 'MongoError' && err.code === 11000)) {
                    console.error('datadog.createUserOnce:', err);
                    return done(err)
                }
            }
            calledOnce = true
            return done();
        });
    }
}

module.exports = {
  createUserOnce: createUserOnce()
};
