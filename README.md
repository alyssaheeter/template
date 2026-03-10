{
  "name": "project-name",
  "version": "1.0.0",
  "description": "Project description",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write 'src/**/*.js'",
    "deploy:staging": "./scripts/deploy.sh staging",
    "deploy:production": "./scripts/deploy.sh production"
  },
  "keywords": [],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "@google-cloud/firestore": "^7.1.0",
    "@google-cloud/storage": "^7.7.0",
    "@google-cloud/secret-manager": "^5.0.1",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
