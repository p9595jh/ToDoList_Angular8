var express = require('express');
var router = express.Router();
// =================================
const passport = require('passport');
const Work = require('../models/work');

// =================================

router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Work.find({userid: req.user.userid}, (err, works) => {
        if ( err ) res.status(500).json(err);
        else res.json(works);
    });
});

router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    const newWork = {
        date: req.body.date,
        work: req.body.work,
        userid: req.user.userid
    };
    // Work.addWork(newWork, (err, work) => {
    //     console.log('im a bad guy');
    //     if ( err ) {
    //         res.status(500).json(err);
    //     }
    //     else {
    //         console.log(work);
    //         work.success = true;
    //         res.status(201).json(work);
    //     }
    // });
    Work.insertMany([newWork], (err, works) => {
        if ( err ) res.status(500).json(err);
        else res.status(201).json({success: true});
    });
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
