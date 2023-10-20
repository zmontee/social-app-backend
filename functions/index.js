const functions = require("firebase-functions");

//Express framework
const app = require('express')();
const { db } = require('./utils/admin');

const cors = require('cors');
app.use(cors());

const {
    getAllScreams,
    postOneScream,
    getScream,
    commentOnScream,
    likeScream,
    unlikeScream,
    deleteScream
} = require('./handlers/screams');

const {
    signUp,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead
} = require('./handlers/users');

const { fbAuth } = require('./utils/fbAuth');

//Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', fbAuth, postOneScream);
app.get('/scream/:screamId', getScream);
app.delete('/scream/:screamId', fbAuth, deleteScream);
app.get('/scream/:screamId/like', fbAuth, likeScream);
app.get('/scream/:screamId/unlike', fbAuth, unlikeScream);
app.post('/scream/:screamId/comment', fbAuth, commentOnScream)

//Users routes
app.post('/signup', signUp);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);
app.post('/user', fbAuth, addUserDetails);
app.get('/user', fbAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', fbAuth, markNotificationsRead);

exports.api = functions.region('europe-west1').https.onRequest(app);

exports.createNotificationOnLike = functions
    .region('europe-west1')
    .firestore.document(`likes/{id}`)
    .onCreate((snapshot) => {
        return db.doc(`/screams/${snapshot.data().screamId}`)
            .get()
            .then(doc => {
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        screamId: doc.id
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    })
exports.deleteNotificationOnUnlike = functions
    .region('europe-west1')
    .firestore.document(`likes/{id}`)
    .onDelete((snapshot) => {
        return db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch(err => {
                console.error(err);
            })
    })


exports.createNotificationOnComment = functions
    .region('europe-west1')
    .firestore.document(`comments/{id}`)
    .onCreate(snapshot => {
       return db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'comment',
                        read: false,
                        screamId: doc.id
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    })

exports.onUserImageChange = functions
    .region('europe-west1')
    .firestore.document(`/users/{userId}`)
    .onUpdate(change => {
        console.log(change.before.data());
        console.log(change.after.data());

        if(change.before.data().imageUrl !== change.after.data().imageUrl) {
            console.log('image has changed');
            const batch = db.batch();
            return db
                .collection('screams')
                .where('userHandle', '==', change.before.data().handle)
                .get()
                .then(data => {
                    data.forEach(doc => {
                        const scream = db.doc(`/screams/${doc.id}`);
                        batch.update(scream, {userImage: change.after.data().imageUrl});
                    })
                    return batch.commit();
                })
        } else return true;
    })

//Delete all comments, likes and notifications of scream when we delete this scream
exports.onScreamDelete = functions
    .region('europe-west1')
    .firestore.document(`/screams/{screamId}`)
    .onDelete((snapshot, context) => {
        const screamId = context.params.screamId;
        const batch = db.batch();
        return db
            .collection('comments')
            .where('screamId', '==', screamId)
            .get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                });
                return db.collection('likes').where('screamId', '==', screamId).get();
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/likes/${doc.id}`));
                })
                return db.collection('notifications').where('screamId', '==', screamId).get();
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/notifications/${doc.id}`));
                })
                return batch.commit();
            })
            .catch(err => {
                console.error(err);
            })
    })
