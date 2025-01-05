export const CREATE_COIN_VALIDATION_REGEXP = {
  COIN_NAME: /^[a-zA-Z0-9\s]+$/,
  COIN_SYMBOL: /^[a-zA-Z0-9_]+$/,
  TOTAL_SUPPLY: /^\d+$/,
};

export const BASE_64_IMAGE_REGEXP = /^data:image\/(png|jpeg|jpg|gif);base64,([A-Za-z0-9+/]+={0,2})$/;

export const URL_REGEXP = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
