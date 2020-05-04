const { db } = require('../util/admin');

exports.getAllActivities = (request, response) => {
	db
		.collection('activities')
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let activities = [];
			data.forEach((doc) => {
				activities.push({
          activityId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
				});
			});
			return response.json(activities);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.postOneActivity = (request, response) => {
	if (request.body.body.trim() === '') {
		return response.status(400).json({ body: 'Body cannot be empty' });
    }
    
    if(request.body.title.trim() === '') {
        return response.status(400).json({ title: 'Title cannot be empty' });
    }
    
    const newActivityItem = {
        title: request.body.title,
        body: request.body.body,
        createdAt: new Date().toISOString()
    }
    db
        .collection('activities')
        .add(newActivityItem)
        .then((doc)=>{
            const responseActivityItem = newActivityItem;
            responseActivityItem.id = doc.id;
            return response.json(responseActivityItem);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
};

exports.deleteActivity = (request, response) => {
    const document = db.doc(`/activities/${request.params.activityId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Activity not found' })
            }
            return document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successfull' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.editActivity = ( request, response ) => { 
    if(request.body.activityId || request.body.createdAt){
        response.status(403).json({message: 'This attributed cannot be edited'});
    }
    let document = db.collection('activities').doc(`${request.params.activityId}`);
    document.update(request.body)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ 
                error: err.code 
        });
    });
};