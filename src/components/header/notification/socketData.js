import axios from 'axios';

const socketData = async () => {
  try {
    const response = await axios.get("http://localhost:5002/dc/outage");
    return response.data;
  } catch (error) {
    // Handle errors here
    console.error(error);
    return null;
  }
};

export {socketData}