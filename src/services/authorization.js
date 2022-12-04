const authorization = token => {
  return {
    rejectUnauthorized: false,
    authorization: `Bearer ${token}`,
  };
};

export default authorization;
