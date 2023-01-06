import axios from 'axios';

import {SERVER_URL} from '../config/config';
import {API} from './api';
import authorization from './authorization';

export const registerRequest = async payload => {
  return axios
    .post(SERVER_URL + API.REGISTER, payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const loginRequest = async payload => {
  return axios
    .post(SERVER_URL + API.LOGIN, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getTypes = async () => {
  return axios
    .get(SERVER_URL + API.GET_TYPES)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getTagsRequest = async token => {
  return axios
    .get(SERVER_URL + API.GET_TAGS, {
      headers: authorization(token),
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const addCapstoneRequest = async (payload, token) => {
  return axios
    .post(SERVER_URL + API.ADD_CAPSTONE, payload, {
      headers: {
        ...authorization(token),
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const updateCapstoneRequest = async (payload, token) => {
  return axios
    .post(SERVER_URL + API.UPDATE_CAPSTONE, payload, {
      headers: {
        ...authorization(token),
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getCapstonesRequest = async () => {
  return axios
    .get(SERVER_URL + API.GET_CAPSTONES)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getCapstonesAssignedRequest = async id => {
  return axios
    .get(SERVER_URL + API.GET_ASSIGNED + id)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getCapstonesOwnedRequest = async id => {
  return axios
    .get(SERVER_URL + API.GET_OWNED + id)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const updateRatingRequest = async (payload, token) => {
  return axios
    .post(SERVER_URL + API.UPDATE_RATING, payload, {
      headers: {
        ...authorization(token),
        Accept: 'application/json',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const updatePercentageRequest = async (payload, token) => {
  return axios
    .post(SERVER_URL + API.UPDATE_PERCENTAGE, payload, {
      headers: {
        ...authorization(token),
        Accept: 'application/json',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const updateViewsRequest = async (payload, token) => {
  return axios
    .post(SERVER_URL + API.UPDATE_VIEWS, payload, {
      headers: {
        ...authorization(token),
        Accept: 'application/json',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const addCommentRequest = async (payload, token) => {
  return axios
    .post(SERVER_URL + API.ADD_COMMENT, payload, {
      headers: {
        ...authorization(token),
        Accept: 'application/json',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getCommentsRequest = async id => {
  return axios
    .get(SERVER_URL + API.GET_COMMENTS + id)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getCapstoneRequest = async id => {
  return axios
    .get(SERVER_URL + API.GET_CAPSTONE + id)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getProfessorsRequest = async () => {
  return axios
    .get(SERVER_URL + API.GET_PROFESSORS)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const uploadDocumentRequest = async (payload, token) => {
  return axios
    .post(SERVER_URL + API.UPLOAD_DOCUMENT, payload, {
      headers: {
        ...authorization(token),
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const updateUserRequest = async (payload, token) => {
  return axios
    .post(SERVER_URL + API.UPDATE_USER, payload, {
      headers: {
        ...authorization(token),
        Accept: 'application/json',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};
