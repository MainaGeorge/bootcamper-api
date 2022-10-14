# bootcamper-api
This is a project with crud operations using bootcamps. A user can create only a single bootcamp. 
Only that use can manipulate that bootcamp and or create courses for it (bar the admin). A bootcamp can hold more than one course. any authenticated can review a bootcamp. 
An admin can perform crud operations on users.

To get the project up and running, you need to create a .env file at the root of the project with the following properties:
PORT=The port the app will listen on
CONNECTION_STRING=The connection string to mongo db
NODE_ENV=environment, preferably development
API_VERSION=/api/v1
POSITION_STACK_API_KEY=the api for the stack api to calculate geo code data,
JWT_ENCODING_SECRET=The secret to encode the jwt token
JWT_EXPIRES_IN=the amount of time that the token is valid
JWT_COOKIE_EXPIRES_IN=amount of time the set cookie is valid
SMTP_HOST=host for the email provider
SMTP_PORT=port for the email provider
SMTP_USERNAME=credentials for the email provider
SMTP_PASSWORD=password for the email provider
SMTP_FROM=name that will appear on the from field in the sent emails
SMTP_FROM_EMAIL=the email that will appear on the from email

run the data-seeder.js using npm run seed

you can make requests as in the collection provided with this repo
