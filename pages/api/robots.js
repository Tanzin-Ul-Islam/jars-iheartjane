import axios from "axios";
import api from '../../config/api.json';
import server from '../../config/server.json';
import https from 'https';

export default async function handler(req, res) {
  let robotData = "";
  try {
    const mode = process.env.NODE_ENV;
    let baseUrl = "", extra = {};
    if (mode == "development") {
      baseUrl = `${server.staging.STAGING_SERVER_HOST}api/v1/`;
    } else if (mode == "production") {
      baseUrl = `${server.server.SERVER_HOST}api/v1/`;
      const agent = new https.Agent({ rejectUnauthorized: false });
      extra = { httpsAgent: agent }
    }    
    let { data } = await axios.get(`${baseUrl}${api.cms.RobotTxt}`, extra);
    robotData = data?.data?.[0].robotTxt;
  } catch (error) {
    console.log(error);
  }

  res.send(robotData);
}
