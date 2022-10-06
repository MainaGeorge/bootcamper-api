const fetch = require('node-fetch');

const geocode = async location => {
    const response = await fetch(`http://api.positionstack.com/v1/forward?access_key=${process.env.POSITION_STACK_API_KEY}&query=${location}`);
    return await response.json();
}

module.exports = geocode;