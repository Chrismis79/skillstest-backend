const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');


//Profile Service
class ProfileService {
    constructor() {
        this.profiles = []
    }

    async find() {
        return this.profiles;
    }
    async create(data) {
        const profileData = {
            id: this.profiles.length,
            name: data.name,
            email: data.email,
            username: data.username
        }
        profileData.time = moment().format('h:mm:ss a');
        this.profiles.push(profileData);
        return profileData;
    }
}

// Skills Test Service

const app = express(feathers());

app.use(express.json());

//Configure socket.io realtime APIs
app.configure(socketio())

//Enable REST services

app.configure(express.rest());

//Register routes (services)
app.use('/profile', new ProfileService());

//New connections connect to skillstest channel
app.on('connection', conn => app.channel('skillstest').join(conn));

//Publish events to 'skillstest'
app.publish(data => app.channel('skillstest'));

const PORT = process.env.PORT || 5000;

app.listen(PORT).on('listening', () => console.log(`Server listening on port ${PORT}`))

