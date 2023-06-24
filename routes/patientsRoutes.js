const express = require('express');
const {patient_post, patient_delete, patient_get, patient_update} = require('../controllers/patientController');
const { authRequired } = require('../middleware/authMiddleware');

const patientRouter = express.Router();

patientRouter.post('/add-patient', patient_post);
patientRouter.get('/patients/delete/:id', patient_delete)
patientRouter.get('/patients/:id', authRequired, patient_get);
patientRouter.post('/patient/update', patient_update )

module.exports = patientRouter;