# iPay-backend

## Preparation

Install node with

    brew install node
    
Update npm with

	sudo npm install -g npm
    
Install n with
	
	sudo npm install -g n
	
Install latest node with

	sudo n latest
	
## Usage

Go into project directory and install dependencies

	npm i
	
Start server
	
	npm start
	
Now it's running on localhost:3000
	
## APIs

### Phone signup & signin

Send verify message

	POST /users/sendVerifySMS
	params: country -- Country code
			phone   -- Phone number
			
	return: errcode with error object { message: error message } or 200 with empty response
			
Register with phone number
	
	POST /users/phoneSignup
	params: country -- Country code
			phone   -- Phone number
			code    -- Verification code
			name    -- User's name
			gender  -- User's gender
			password
			birthday-- Date String or json date
	
	return preview:
	{
	  "name": "jiaming",
	  "birthday": "1993-02-24T00:00:00.000Z",
	  "gender": "male",
	  "_id": "583cd6fddd370f6470155ea1",
	  "jwtToken": 	  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODNjZDZmZGRkMzcwZjY0NzAxNTVlYTEiLCJpYXQiOjE0ODAzODIyMDUsImV4cCI6MTQ4MTY3ODIwNX0.BdCd85O0ieKfoIR98kX8I5Bs-qY4C_DbVEPvazuIn3c"
	}
			
Login in with phone number
			
	POST /users/phoneSignin
	params: country
			phone
			password
			
	
	return preview:
	{
	  "_id": "583cd6fddd370f6470155ea1",
	  "name": "jiaming",
	  "birthday": "1993-02-24T00:00:00.000Z",
	  "gender": "male",
	  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODNjZDZmZGRkMzcwZjY0NzAxNTVlYTEiLCJpYXQiOjE0ODAzODIyODUsImV4cCI6MTQ4MTY3ODI4NX0.nUY2ShMuJQnVcQndtpdvfVTb5I-WzLzPhrvRngCOIb0"
	}
	
### Wechat signin & signup

Register with wechat access code

	POST /users/wechatSignup
	params: code -- wechat access code got from wechat
			name
			gender
			birthday
			
Login in with wechat access code

	POST /users/wechatSignin
	params: code -- wechat access code got from wechat

