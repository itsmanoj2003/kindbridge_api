var express = require('express')
var bcrypt = require('bcryptjs')
const { default: orphanageModel } = require('../models/orphanageModel')
const { model } = require('mongoose')
var router = express.Router()

router.post('/createorphanage', async(req,res)=>{
    try{
        const{cciRegistrationnumber,
        location,
        districtCode,
        institutionCode,
        institutionType,
        managingAuthority,
        password} = req.body

        const hanshedPassword = await bcrypt.hash(password,10)
        const newOrphanage = new orphanageModel({
            cciRegistrationnumber,
            location,
            districtCode,
            institutionCode,
            institutionType,
            managingAuthority,
            password:hanshedPassword})
        
        await newOrphanage.save()
        // const updatedOrphanage = newOrphanage.toObject()
        // delete updatedOrphanage.password
        return res.status(200).json({message:"Signup Successfull",newOrphanage})
    }

    catch(err){
        return res.status(500).json({message:"Server Failed"})
    }

})



router.post('/orphanagelogin', async (req, res) => {
    try {
        const { cciRegistrationnumber, password } = req.body;

        // Check orphanage exists
        const orphanage = await orphanageModel.findOne({
            cciRegistrationnumber
        });

        if (!orphanage) {
            return res.status(404).json({
                message: "Orphanage Not Found"
            });
        }

        // Check password
        const validatePassword = await bcrypt.compare(
            password,
            orphanage.password
        );

        if (!validatePassword) {
            return res.status(401).json({
                message: "Incorrect Password"
            });
        }

        // Check approval status
        // if (!orphanage.approvalStatus) {
        //     return res.status(403).json({
        //         message: "Your Account is Waiting for Admin Approval. Loggin Successfull"
        //     });
        // }

        // Remove password from response
        const updatedOrphanage = orphanage.toObject();
        delete updatedOrphanage.password;

        return res.status(200).json({
            message: "Login Successful. Your Account is Waiting for Admin Approval",
            updatedOrphanage
        });

    } catch (err) {
        return res.status(500).json({
            message: "Server Failed"
        });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const orphanage = await orphanageModel
            .findById(id)
            .select('-password');

        return res.status(200).json({
            message: "Orphanage Details Fetched Successfully",
            orphanage
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error"
        });
    }
});


module.exports = router