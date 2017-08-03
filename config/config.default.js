const fs = require('fs');
const path = require('path');


module.exports = (appInfo) => {
  const config = {};

  config.keys = 'default-security-key';

  config.security = {
    csrf: {
      enable: false,
    },
  },

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  return config;
};
