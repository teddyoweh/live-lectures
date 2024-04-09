export const base_api = 'http://localhost:9990';
export const base_microservice = 'http://10.252.41.28:5555';

function wrapBaseApi(path) {
  return `${base_api}/${path}`;
}

function wrapBaseMicroservice(path) {
    return `${base_microservice}/${path}`;
    }

export const endpoints = {
    'upload_video': wrapBaseMicroservice('upload_video'),
    'get_roadmap': wrapBaseMicroservice('roadmap'),
    'ask_video': wrapBaseMicroservice('ask_video'),
    'process_transcript': wrapBaseMicroservice('process_transcript'),
    'get_recordings': wrapBaseApi('base/get_recordings'),
 
}

export const headers =   {
   'Accept':"*/*",
  'Access-Control-Allow-Origin': '*',
 }
