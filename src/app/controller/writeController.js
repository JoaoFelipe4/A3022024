const pet= require("../model/writeModel");
const user = require("../model/user");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sharp = require('sharp');

const s3 = require('@aws-sdk/client-s3');
const s3URL = require('@aws-sdk/s3-request-presigner');
const { json } = require("express");

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const awsBucketName = process.env.AWS_BUCKET_NAME;
const awsBucketRegion = process.env.AWS_BUCKET_REGION;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const mys3 = new s3.S3Client({
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretAccessKey
  },
  region:awsBucketRegion
});

class writeController {

  async storePet(req, res) {

    const buffer = await sharp(req.file.buffer).resize({height:1920, width:1080, fit: "contain"}).toBuffer();

    const imageName = randomImageName();

    const params = {
      Bucket:awsBucketName,
      Key: imageName,
      Body: buffer,
      ContentType:req.file.mimtype
    };

    const PET = {
      ...JSON.parse(req.body.data),
      image: imageName
    };

    const newPetInfo = new pet(PET);
    
    const nPet = await pet.create(newPetInfo);

    //console.log(JSON.parse(req.body.data));

    const command = new s3.PutObjectCommand(params);

    await mys3.send(command);


    return res.json(nPet);
  }

  async storeUser(req, res) {
    try {
    
      const hashSenha = await bcrypt.hash(req.body.senha,8);
      const newUser = new user({
        ...req.body,
        senha:hashSenha
      });
      
      const data = await user.create(newUser);
      return res.json(data);
    
    } catch (error) {
      console.log(error);
      return error;
    }
    
    
  }

  async deletePet(req, res) {

    const post = await pet.findOne({_id:req.params.id}).exec();

    if (!post) {
      res.status(404).send("post not found!");
      return;
    }

    const getObjectParams = {
      Bucket:awsBucketName,
      Key: post.image
    };

    const command = new s3.DeleteObjectCommand(getObjectParams);
    await mys3.send(command);

    await pet.deleteOne({_id:req.params.id});

    res.send(post);
  }

  async index(req, res) {

    const data = await pet.find({});

    for (const post of data){


    const getObjectParams = {
      Bucket:awsBucketName,
      Key: post.image
    };

    const command = new s3.GetObjectCommand(getObjectParams);
    const url = await s3URL.getSignedUrl(mys3 , command, {expiresIn: 3600});
    post.imageUrl = url;
    
    }

    return res.json(data);
  }

}

module.exports = new writeController();