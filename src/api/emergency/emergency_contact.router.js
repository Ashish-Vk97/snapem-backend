const router = require('express').Router();

const authenticateToken = require('../../helpers/middlewares/authenticateToken');

const { createEmergencyContact ,getAllEmergencyContacts, getEmergencyById,updateEmergencyById,deleteEmergencyContact} = require('./emergency_contact.controller');

router.post('/create',authenticateToken,  createEmergencyContact);
router.get('/', authenticateToken, getAllEmergencyContacts);
router.get('/:id', getEmergencyById);
router.put('/update/:id', updateEmergencyById);
router.delete('/delete/:id', deleteEmergencyContact);

module.exports = router;