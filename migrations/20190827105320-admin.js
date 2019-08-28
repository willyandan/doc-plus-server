module.exports = {
  async up(db) {
    const role = await db.collection('roles').findOne({name:'admin'})
    db.collection('admins').insert({
      email:'willyan.dantunes@gmail.com', 
      password:'123',
      name:'Willyan Antunes',
      role:role._id
    })
  },

  down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
