const baseURL = 'https://api.dewp.eu.org';

export const getAllObjects = `${baseURL}/get-all-objects`;

export const getObjectById = (id) => `${baseURL}/get-object-by-id?id=${id}`;

export const getObjectByIds = `${baseURL}/get-objects-by-ids`;

export const updateObjectById = (id) => `${baseURL}/update-object-by-id?id=${id}`;

export const generateWorkOrdersByIds = `${baseURL}/generate-workorders-by-ids`;

export const deleteWorkOrdersByIds = `${baseURL}/delete-workorder-by-object-ids`;

export const deleteObjectById = (id) => `${baseURL}/delete-object-by-id${id}`;

export const login = `${baseURL}/login`;

export const getImage = (filePath) => `${baseURL}/get-image?filename=${filePath}`;
