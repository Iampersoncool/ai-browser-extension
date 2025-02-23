import KVStorageService from './KVStorageService';

const ApiUrlStorageService = new KVStorageService(
  'local:base-api-url',
  'http://localhost:6969'
);

export default ApiUrlStorageService;
