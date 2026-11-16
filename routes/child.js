var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

const { default: childModel } = require('../models/childModel');
const { default: orphanageModel } = require('../models/orphanageModel');


router.post('/addchild', async (req, res) => {

    try {

        const {
            childName,
            age,
            gender,
            moleLocation,
            scarLocation,
            otherIdentityMarks,
            orphanageId
        } = req.body;

        if (!childName || !age || !gender || !orphanageId) {
            return res.status(400).json({
                message: 'Please provide all required fields'
            });
        }

        if (!mongoose.isValidObjectId(orphanageId)) {
            return res.status(400).json({
                message: 'Invalid Orphanage ID'
            });
        }

        const orphanage = await orphanageModel.findById(orphanageId);

        if (!orphanage) {
            return res.status(404).json({
                message: 'Orphanage Not Found'
            });
        }

        if (orphanage.approvalStatus !== true) {
            return res.status(403).json({
                message: 'Your Orphanage is not approved yet'
            });
        }

        const newChild = new childModel({
            childName,
            age,
            gender,
            moleLocation,
            scarLocation,
            otherIdentityMarks,
            orphanageId
        });

        await newChild.save();

        return res.status(201).json({
            message: 'Child Added Successfully',
            newChild
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: 'Server Error'
        });

    }

});


router.get('/getchildren/:orphanageId', async (req, res) => {

    try {

        const { orphanageId } = req.params;

        const children = await childModel.find({
            orphanageId: orphanageId
        });

        return res.status(200).json({
            message: "Children Fetched Successfully",
            children
        });

    } catch (error) {

        return res.status(500).json({
            message: "Server Error"
        });

    }

});



router.get('/getallchildren', async (req, res) => {

    try {

        const children = await childModel.find()
            .populate('orphanageId', 'location');

        return res.status(200).json({
            message: "All Children Fetched Successfully",
            children
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Server Error"
        });

    }

});


router.put('/updatechild/:id', async(req,res)=>{
    
    try{
        const {id} = req.params
        const updateChild = {...req.body}
        await childModel.findByIdAndUpdate(id,updateChild)
        res.status(200).json({message:"Child Updated Successfully"})
    }
    catch(error){
        console.log(error);

            res.status(500).json({
                message: 'Server Error'
            });
    }
    
})


router.delete('/deletechild/:id', async(req,res)=>{
    try{
        const {id} = req.params

        await childModel.findByIdAndDelete(id)
        res.status(200).json({message:"Child Deleted Successfully"})
    }
    catch(error){
        res.status(500).json({

            message: error.message

        });

    }
})

module.exports = router;