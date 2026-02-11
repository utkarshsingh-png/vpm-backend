const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/role');

// Visitor routes
router.post('/request', auth, roleCheck('visitor'), visitController.createVisit);
router.get('/my-visits', auth, roleCheck('visitor'), visitController.getMyVisits);
router.put('/cancel/:visitId', auth, roleCheck('visitor'), visitController.cancelVisit);

// Client/Host routes
router.get('/host/pending', auth, roleCheck('host'), visitController.getPendingVisitsForHost);
router.get('/host/all', auth, roleCheck('host'), visitController.getAllVisitsForHost);
router.put('/approve/:visitId', auth, roleCheck('host'), visitController.approveVisit);
router.put('/reject/:visitId', auth, roleCheck('host'), visitController.rejectVisit);
router.put('/host/update/:visitId', auth, roleCheck('host'), visitController.updateVisitDetails); // NEW ROUTE

// Security routes
router.post('/check-in', auth, roleCheck('security'), visitController.checkIn);
router.post('/check-out/:visitId', auth, roleCheck('security'), visitController.checkOut);
router.get('/ongoing', auth, roleCheck('security'), visitController.getOngoingVisits);
router.post('/qr-verify', auth, roleCheck('security'), visitController.getVisitByQRCode);

// Common routes (accessible by authorized roles)
router.get('/:visitId', auth, visitController.getVisitById);

module.exports = router;