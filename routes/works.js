var express = require('express');
var router = express.Router();
// =================================
const passport = require('passport');
const Work = require('../models/work');

// =================================

router.get('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try {
        const works = await Work.find({userid: req.user.userid});
        res.json(works);
    } catch(err) {
        res.status(500).json(err);
    }
});

router.post('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    const newWork = new Work({
        date: req.body.date,
        work: req.body.work,
        userid: req.user.userid
    });
    try {
        const work = await newWork.save();
        res.status(201).json({success: true});
    } catch(err) {
        res.status(500).json(err);
    }
});

router.get('/:_id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Work.findOne({_id: req.params._id}, (err, work) => {
        if ( err ) res.status(500).json(err);
        else res.json(work);
    });
});

router.put('/:_id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    const newWork = {
        date: req.body.date,
        work: req.body.work
    };
    Work.findOneAndUpdate({_id: req.params._id}, newWork, (err, work) => {
        if ( err ) res.status(500).json(err);
        else res.json(work);
    });
});

router.delete('/:_id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Work.findOneAndDelete({_id: req.params._id}, (err, work) => {
        if ( err ) res.status(500).json(err);
        else res.status(204).json({});
    });
});

module.exports = router;
