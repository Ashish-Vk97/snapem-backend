const router = require('express').Router();

const authenticateToken = require('../../helpers/middlewares/authenticateToken');

const { createEmergencyContact ,getAllEmergencyContacts, getEmergencyById,updateEmergencyById,deleteEmergencyContact} = require('./emergency_contact.controller');

router.post('/create',authenticateToken,  createEmergencyContact);
router.get('/all', authenticateToken, getAllEmergencyContacts);
router.get('/:id',authenticateToken, getEmergencyById);
router.put('/update/:id',authenticateToken, updateEmergencyById);
router.delete('/delete/:id',authenticateToken, deleteEmergencyContact);

module.exports = router;