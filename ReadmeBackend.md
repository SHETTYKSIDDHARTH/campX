-->user model consisits of general details of users schema
-->Otp validation of the email is done and the otp's sent are temporarily stored as a cluster in mongoDB and corresponding otpRequest.model.js is written
-->The otp allocated to that particular email is temporarily stored here and when the user hits /auth/verify-otp the corresponding email and otp are evaluated and if they match they will be discarded on the spot 

ADMIN
{
  "name": "Admin",
  "email": "1SI22EC099@SIT.AC.IN",
  "usn": "1SI22EC099",
  "password": "sid123",
  "role": "admin"
}

//Student
{
  "name": "student1",
  "email": "shettysiddharth2k05@gmail.com",
  "usn": "1SI22EC099",
  "password": "sid123",
  "role": "student"
}

//Chairman