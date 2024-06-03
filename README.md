# This is Simple Nodejs Express Starter Kit

#### Node express + Typescript + Prisma ORM REST api 

You can use it for your project. If it is useful for you,  
don't forget to give me a **GitHub star**, please.

In this node/express template

   - Express framework 
   - Typescript
   - DB - MySQL or PostgreSQL
   - Prisma ORM
   - REST api 
   - JWT auth
   - bcrypt
   - express-validator 
   - error handler 
   - file uploading 
   - Authorization
   - Pagination ( offset-based & cursor-based ) etc.

In order to use it,

**Create** a .env file and add this.  
For **MySQL**

```
DATABASE_URL="mysql://username:password@localhost:3306/mydb"
TOKEN_SECRET="something hard to guess"

```

For **PostgreSQL**

```
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
TOKEN_SECRET="something hard to guess"

```
Please note.   
*TOKEN_SECRET* should be complex and hard to guess.  

If you use file uploading feature in this kit,  
create nested folders `uploads/images` in the root directory.  
But making directories is up to you. You can configure in `src/middlewares/uploadFile.js`.  
For large projects, it is the best solution to use aws S3, DigitalOcean space, etc., 
instead of using file system.  

## Step by Step Installation

```bash
mkdir lucky
cd lucky
git clone https://github.com/Bonekyaw/node-express-prisma-rest.git .
rm -rf .git
npm install
npm run dev

```  
Before you run, make sure you've created .env file and completed required information.  

I'm trying best to provide the **latest** version. But some packages may not be latest after some months. If so, you can upgrade manually one after one, or you can upgrade all at once. 

```bash
npm install -g npm-check-updates
npm outdated
ncu --upgrade
npm install
```
If you find some codes not working well, please let me know your problems.  

### API Endpoints

List of available routes:  

`POST /api/v1/register` - Register  
`POST /api/v1/verify-otp` - Verify OTP  
`POST /api/v1/confirm-password` - Confirm password  
`POST /api/v1/login` - Login  
`POST /api/v1/refresh-token` - Refresh for expired Token  
`PUT /api/v1/admins/upload` - Uploading file or files  
`GET /api/v1/admins` - Get admins' list by pagination   

#### Explanation  

**Auth routes**:  
`POST /api/v1/register` - Register  
```javascript
Request 
{ 
  "phone": "0977******7"
}

Response
{
    "message": "We are sending OTP to 0977******7.",
    "phone": "77******7",
    "token": "3llh4zb6rkygbrah5demt7"
}
```  
`POST /api/v1/verify-otp` - Verify OTP  
```javascript
Request
{
  "phone": "77******7",
  "token": "3llh4zb6rkygbrah5demt7",
  "otp": "123456"
}

Response
{
    "message": "Successfully OTP is verified",
    "phone": "77******7",
    "token": "xdyj8leue6ndwqoxc9lzaxl16enm0gkn"
}
```  
`POST /api/v1/confirm-password` - Confirm password  
```javascript
Request
{
  "token": "xdyj8leue6ndwqoxc9lzaxl16enm0gkn",
  "phone": "77******7",
  "password": "12345678"
}

Response
{
    "message": "Successfully created an account.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWIwZDhmNmUwNGJiOGMzNWY0MTlkNiIsImlhdCI6MTcxNzI0MzI4MCwiZXhwIjoxNzE3MjQ2ODgwfQ.dvJT2UsGsC1za3lhcu3b3OrMR8BCIKvSlbiIgoBoLJQ",
    "user_id": "1",
    "randomToken": "p1jlepl7t7pqcdgg1sm0crbgbodi67auj"
}
```
`POST /api/v1/login` - Login  
```javascript
Request
{
    "phone": "0977******7",
    "password": "12345678"
}

Response
{
    "message": "Successfully Logged In.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTVlMDI5NzE2ZjljYTU1NTRjYTU4NCIsImlhdCI6MTcxNzQwMjQ1OSwiZXhwIjoxNzE3NDA2MDU5fQ.tZNAwjt4rM3tiZgl1LdwfYScbPqoOnMTtaKOTI1pEXY",
    "user_id": "1",
    "randomToken": "25uzndvz1lzu65fpjn9b6suaxj8gm91k"
}
```

**Refresh routes**:  
`POST /api/v1/refresh-token` - Refresh for expired Token  
```javascript
Request with Authorization Header
{
    "user_id": "1",
    "randomToken": "b6x9na0z5abc7wix1t2ojj5hdkk7aosm6"
}

Response 
{
    "message": "Successfully sent a new token.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTgzODYyNzliMmEzZjEzNDZhYjAwZCIsImlhdCI6MTcxNzA1NzY5NiwiZXhwIjoxNzE3MDYxMjk2fQ.4QyftFaMZE7MT_odGdP8yWsGrclaMstc_867PvTfV88",
    "user_id": "1",
    "randomToken": "x3y20n178w8m6fwptxx5pdwqao8ihpsl"
}
```   

**File Upload routes**:  
`PUT /api/v1/admins/upload` - Uploading file or files  
```javascript
Request with Authorization Header
Body form-data Key = avatar
``` 

**Pagination routes**:  
`GET /api/v1/admins` - Get admins' list by pagination   
```javascript
Request with Authorization Header
Params Key = page, limit (OR) cursor, limit
```

### How to develop your own products using this Starter Kits  

When you add other route files, you can also create `routes/v1/api` `routes/v1/web` folders and use prefix for route defination. for example,

```javascript
const adminRoutes = require("./routes/v1/web/admin");
...
app.use("/v1/admins", isAuth, authorise(true, "admin"), adminRoutes);
```

Hey, you see the words: `isAuth` & `authorise` ?  
Yeah, these are custom middlewares. You can create and use them by yourself. I will show how to use my sample authorization middleware.   

Authorization as a middleware

```javascript
const authorise = require('./middlewares/authorise');
...
app.use("/api/v1", isAuth, authorise(true, "admin"), adminRoutes);

router.get('/admins', authorise(true, "admin"), adminController.index);
```
Authorization as a function
```javascript
const authorise = require("./../utils/authorise");
...
authorise(true, user, "admin");
```
`true, "admin"` means the account is allowed only if its role is "admin". `false, "user"` means the account is not allowed if its role is "user".  
`ture, "admin"` === `false, "user", "supplier"`  
`false, "user"` === `true, "admin", "supplier"`
  
`true, user, "admin"` In these parameters, admin param is an instance model of the database table.  

### Pagination
There are two ways in pagination: **offset-based** and **cursor-based**. You can read more about pros and cons [here](https://www.prisma.io/docs/orm/prisma-client/queries/pagination). But you can use my pagination logic very easily.  

For offset-based 

```javascript
const { offset, noCount, cursor } = require("./../utils/paginate");
...
const { page, limit } = req.query;

const filters = { status: "active" };
const order = { createdAt: "desc" };
const fields = {
      id: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      lastLogin: true,
      profile: true,
      createdAt: true,
    };

const admins = await offset(
      prisma.admin,
      page,
      limit,
      filters,
      order,
      fields,
    );
res.status(200).json(admins);

```
For cursor-based
```javascript
const { offset, noCount, cursor } = require("./../utils/paginate");
...
const cursors = req.query.cursor ? { id: +req.query.cursor } : null;
const limit = req.query.limit;

const filters = { status: "active" };
const order = { createdAt: "desc" };
const fields = {
      id: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      lastLogin: true,
      profile: true,
      createdAt: true,
    };

const admins = await cursor(
      prisma.admin,
      cursors,
      limit,
      filters,
      order,
      fields
    );
res.status(200).json(admins);

```   

I promise new features will come in the future if I have much time.

If you have something hard to solve,
DM  
<phonenai2014@gmail.com>  
<https://www.facebook.com/phonenyo1986/>  
<https://www.linkedin.com/in/phone-nyo-704596135>  

#### Find more other Starter kits of mine ?   

`My Kits For REST Api`

  
  [Express + Prisma ORM + mongodb - rest api](https://github.com/Bonekyaw/node-express-prisma-mongodb)  
  [Express + Prisma ORM + SQL - rest api](https://github.com/Bonekyaw/node-express-prisma-rest) - Now you are here  
  [Express + mongodb - rest api](https://github.com/Bonekyaw/node-express-mongodb-rest)  
  [Express + mongoose ODM - rest api](https://github.com/Bonekyaw/node-express-nosql-rest)  
  [Express + sequelize ORM - rest api](https://github.com/Bonekyaw/node-express-sql-rest)  

`My Kits For Graphql Api`

  [Apollo server + Prisma ORM + SDL modulerized - graphql api](https://github.com/Bonekyaw/apollo-graphql-prisma)  
  [Express + Prisma ORM + graphql js SDL modulerized - graphql api](https://github.com/Bonekyaw/node-express-graphql-prisma)  
  [Express + Apollo server + mongoose - graphql api](https://github.com/Bonekyaw/node-express-apollo-nosql)  
  [Express + graphql js + mongoose - graphql api](https://github.com/Bonekyaw/node-express-nosql-graphql)  
  [Express + graphql js + sequelize ORM - graphql api](https://github.com/Bonekyaw/node-express-sql-graphql)  

