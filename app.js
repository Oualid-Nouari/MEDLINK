const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRouter = require('./routes/authRoutes');
const patientRouter = require('./routes/patientsRoutes');
const requestRouter = require('./routes/requestRoutes');
const cookieParser = require('cookie-parser');
const { authRequired, checkUser } = require('./middleware/authMiddleware');
const patientModel = require('./models/patientModel');
const jwt = require('jsonwebtoken');
const userModel = require('./models/user');
const requestModel = require('./models/Requests');

app.set('view engine', 'ejs');
// Coonection:
const dbConnect = 'mongodb://0.0.0.0/osix';
mongoose.connect(dbConnect).then(() => app.listen(3000));

// middleware:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));


app.get('*', checkUser);
app.get('/', (req, res) => {
    res.render('login', { title: "Login" });
});



app.get('/dashboard', authRequired, async (req, res) => {
    const allPatients = await patientModel.find();
    const allUsers = await userModel.find();
    const withoutAdmin = allUsers.filter(user => user.isAdmin === undefined);
    const allReqs = await requestModel.find();
    let filteredUsers = [];
    const token = req.cookies.user_token;
    let PatientId = req.query;
    let patient = await patientModel.findById(PatientId.id);
    if (token) {
        jwt.verify(token, 'scrrrrrrrrrrt', async function (err, decodedToken) {
            if (err) {
                next();
            } else {
                const user_patients = [];
                const req_received = [];
                const req_sent = [];
                const user = await userModel.findById(decodedToken.id);
                allPatients.forEach((patient) => {
                    if (user._id.toString() === patient.userId) {
                        user_patients.push(patient);
                    }
                })
                allUsers.forEach((u) => {
                    if (u._id.toString() !== user._id.toString()) {
                        filteredUsers.push(u);
                    }
                })
                allReqs.forEach((request) => {
                    if (request.receiver === user._id.toString()) {
                        req_received.push(request);
                    }
                })
                allReqs.forEach((request) => {
                    if (request.sender === user._id.toString()) {
                        req_sent.push(request);
                    }
                })
                if (user.isAdmin === undefined) {
                    res.render('dashboard', 
                    { title: "Dashboard", allUsers: filteredUsers, patients: user_patients, patient, req_received, req_sent });
                } else {
                    res.render('adminDashboard', { title: "Admin", allUsers, withoutAdmin });
                }
            }
        })
    }
})

app.post('/getSearchedPatients', (req, res, next) => {
    let payload = req.body.payload.trim();
    let searchBy = req.body.searchBy;
    let token = req.cookies.user_token;
    if (token) {
        jwt.verify(token, 'scrrrrrrrrrrt', async (err, decodedToken) => {
            if (err) {
                next();
            } else {
                const user = await userModel.findById(decodedToken.id);
                let search = {}
                let filteredPatients = [];
                if (searchBy === "ipp") {
                    search = await patientModel.find({ ipp: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
                }
                if (searchBy === "cin") {
                    search = await patientModel.find({ cin: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
                }
                if (searchBy === "nom" || searchBy === "prénom") {
                    search = await patientModel
                        .find({
                            $or: [
                                { lastname: { $regex: new RegExp('^' + payload + '.*', 'i') } },
                                { firstname: { $regex: new RegExp('^' + payload + '.*', 'i') } }
                            ]
                        })
                        .exec();
                }
                if (searchBy === "couverture") {
                    search = await patientModel.find({ couverture: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
                }
                search.forEach((item) => {
                    if (item.userId === user._id.toString()) {
                        filteredPatients.push(item)
                    }
                })
                res.send({ payload: filteredPatients });
            }
        })
    }
})

// Routes:

app.use(authRouter);
app.use(patientRouter);
app.use(requestRouter);

app.get('/signingup', (req, res) => {
    res.render('signup', {title: 'Sign up'})
})
// Handling 404

app.use((req, res) => {
    res.render('404')
})