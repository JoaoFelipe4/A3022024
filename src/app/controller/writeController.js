const pet= require("../model/writeModel");
const user = require("../model/user");
const multer = require('multer');
const bcrypt = require('bcryptjs');

const s3 = require('@aws-sdk/client-s3');

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

    const params = {
      Bucket:awsBucketName,
      Key:req.file.originalname,
      Body:req.file.buffer,
      ContentType:req.file.mimtype
    };

    const command = new s3.PutObjectCommand(params);

    await mys3.send(command);

    const data = await pet.create(req.body);

    return res.json(data);
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
  async index(req, res) {

    const data = await pet.find({});

    return res.json(data);
  }
}

module.exports = new writeController();