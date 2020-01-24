const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');


module.exports = {
  async index(request, response) {
    //busca todos devs em um raio de 10km
    //filtar por tecnologias

    const {longitude, latitude, techs} = request.query;

    techsArray = parseStringAsArray(techs);

    const devs = await Dev.find({
      techs: {
        $in: techsArray
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000
        },
      }
    });

    return response.json({devs});
  }
}

