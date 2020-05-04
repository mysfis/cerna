// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllActivities,
    postOneActivity,
    editActivity,
    deleteActivity
} = require('./api/activities')

app.get('/activities', getAllActivities);
app.post('/activity', postOneActivity);
app.put('/activity/:activityId', editActivity);
app.delete('/activity/:activityId', deleteActivity);

exports.api = functions.https.onRequest(app);