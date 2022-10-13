const router = require('express').Router();
const courseRouter = require('./courses.routes');
const Bootcamp = require('../models/bootcamp.model');
const shaperMiddleware = require('../middleware/res.shaper.middleware');
const {protect, restrictToRole} = require('../controllers/auth.controller');
const {
  getBootcamps,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
  findBootcampWithinDistance,
} = require("../controllers/bootcamps.controller");

router.use('/:bootCampId/courses', courseRouter);
router.get('/lat/:lat/long/:long/distance/:distance/unit/:unit',findBootcampWithinDistance);

router
    .route('/')
    .get(shaperMiddleware(Bootcamp, {
      path: 'user',
      select: 'name'
    }), getBootcamps)
    .post(protect, restrictToRole('admin', 'publisher'), createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .delete(protect, restrictToRole('admin', 'publisher'), deleteBootcamp)
    .patch(protect, restrictToRole('admin', 'publisher'), updateBootcamp);

module.exports = router;