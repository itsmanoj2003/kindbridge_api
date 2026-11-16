const express = require('express');
const router = express.Router();

const adoptionModel = require('../models/adoptionModel');
const { default: userModel } = require('../models/userModel');
const { default: childModel } = require('../models/childModel');
const { default: orphanageModel } = require('../models/orphanageModel');

router.post('/addadoption', async (req, res) => {
    try {
        const { childId, orphanageId, userId } = req.body;

        const newAdoption = new adoptionModel({
            childId,
            orphanageId,
            userId
        });

        await newAdoption.save();

        return res.status(200).json({
            message: "Adoption Request Submitted Successfully",
            newAdoption
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
});

router.get('/getadoptions/:orphanageId', async (req, res) => {

    try {

        const { orphanageId } = req.params;

        const adoptions = await adoptionModel.find({
            orphanageId: orphanageId
        });

        const adoptionDetails = await Promise.all(
            adoptions.map(async (adoption) => {

                const user = await userModel.findById(adoption.userId)
                    .select('-password -aadharNumber');

                const child = await childModel.findById(adoption.childId);

                return {
                    adoptionId: adoption._id,
                    user,
                    child
                };

            })
        );

        return res.status(200).json({
            message: "Adoption Requests Fetched Successfully",
            adoptionDetails
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Server Error"
        });

    }

});


router.delete('/deleteadoption/:id', async (req, res) => {

    try {

        const { id } = req.params;

        await adoptionModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Adoption Request Deleted Successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Server Error"
        });

    }

});

module.exports = router;