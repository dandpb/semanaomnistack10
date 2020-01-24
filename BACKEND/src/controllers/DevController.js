const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

//index, show, store, update, destroy

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const {github_username, techs, longitude, latitude} = request.body;
  
    let dev = await Dev.findOne({github_username});

    if(!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
  
      const {name = login, avatar_url, bio } = apiResponse.data;
    
      const techsArray = parseStringAsArray(techs);
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });
    }

    return response.json(dev);
  },

  async update(request, response){
    const {github_username, techs, longitude, latitude} = request.body;
  
    let dev = await Dev.findOne({github_username});

    if(dev) {
      const techsArray = parseStringAsArray(techs);
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    
      await Dev.updateOne( {github_username} , {
        techs: techsArray,
        location
      });
      dev = await Dev.findOne({github_username});
    } else {
      response.status(500).send({ error: 'User not found' });
    }

    return response.json(dev);
  },

  async destroy(request, response){
    const {github_username} = request.params;
  
    let dev = await Dev.findOne({github_username});

    if(dev) {
      await Dev.remove({github_username});
      return response.status(200).send({ message: 'User deleted' });
    } else {
      return response.status(500).send({ error: 'User not found' });
    }
  }

};