module.exports = {
    up(db) {
        db.collection('roles').insertMany([
            { 
                "name":"user",
                "scopes" : [ 
                    "clinic:list", 
                    "clinic:search", 
                    "clinic:read",
                    "service:list", 
                    "service:read", 
                    "user:list", 
                    "user:read",
                ] 
            },
            {
                'name':'admin',
                'scopes':[
                    "clinic:list", 
                    "clinic:search",
                    "clinic:create",
                    "clinic:read",
                    "clinic:update",
                    "clinic:delete",
                    "service:list",
                    "service:create",
                    "service:read",
                    "service:update",
                    "service:delete",
                    "user:list",
                    "user:create",
                    "user:read",
                    "user:update",
                    "user:delete",
                    "agreement:read",
                    "agreement:update",
                    "agreement:delete"
                ]
            }
        ])
    },
    down(db) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
        return db.collection('roles').deleteMany({})
    }
};
