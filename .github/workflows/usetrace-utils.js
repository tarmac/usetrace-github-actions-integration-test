const github = require('@actions/github');
const core = require('@actions/core');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pollStatus(octokit, buildId, apiKey) {
  while (true) {
    try {
      const statusResponse = await octokit.request('GET https://api.usetrace.com/api/build/{build_id}/status', {
        build_id: buildId,
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (statusResponse.status !== 404) {
        console.log('Build status:', statusResponse.data);
        return statusResponse.data;
      }
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
    }
    
    await sleep(1000); // Wait for 1 second before next poll
  }
}

module.exports = { pollStatus };
