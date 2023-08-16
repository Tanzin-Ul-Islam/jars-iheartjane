import axios from "axios";
import api from '../../config/api.json';
import server from '../../config/server.json';
import https from 'https';

export default async function handler(req, res) {
  let blogSiteMapXml = "";
  try {
    const mode = process.env.NODE_ENV;
    let baseUrl = "", extra = {};
    if(mode == "development") {
      baseUrl = `${server.staging.STAGING_SERVER_HOST}api/v1/`;
    } else if(mode == "production") {
      const agent = new https.Agent({ rejectUnauthorized: false });
      extra = { httpsAgent: agent }
      baseUrl = `${server.server.SERVER_HOST}api/v1/`;
    }
    let { data } = await axios.get(`${baseUrl}${api.cms.SiteMap}`, extra);
    blogSiteMapXml = data?.data?.[0].blogSiteMapXml;
  } catch (error) {
    
  }

  res.send(blogSiteMapXml);
}
