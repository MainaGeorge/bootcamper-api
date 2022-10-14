const router = require('express').Router({mergeParams: true});
const shaperMiddleware = require('../middleware/res.shaper.middleware');
const Review = require('../models/reviews.model')
const {protect, restrictToRole} = require('../controllers/auth.controller');
const {createReview, getReview, getReviews, updateReview, deleteReview} = require('../controllers/reviews.controller')

router.get('/', shaperMiddleware(Review), getReviews);
router.get('/:id', getReview);

router.use(protect);
router.post('/', restrictToRole('user'), createReview);

router
    .route('/:id')
    .patch(restrictToRole('user'), updateReview)
    .delete(restrictToRole('user', 'admin'),deleteReview);
module.exports = router;