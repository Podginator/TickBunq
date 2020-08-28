# TickBunq

The lockdown has been pretty challenging - and any good Habits I’ve previously had have been replaced with ordering takeaway, binge watching youtube videos and smoking.I decided to start trying to get some good habits back.

It’s hard to form habits. I started using TickTick which has some habit tracking stuff in it along with Calendar stuff and Todo stuff. but there’s no immediate reward to any of that.

So.. I thought I’d add something. I’ve had my eyes on an iPad mini for a while now, but I really can’t justify it - It’s 449 euros and I think I’d use it like 4 times.

So, I made a little lambda that gets all my Habits, checks if I have done them for the day, and if I have transfers 20 euros from my bunq savings account into an iPad fund.

# .env

The following environment variables must be set in order for this application to work 

## BUNQ_PRIVATE_KEY
The Private Key used to validate the veracity of your requests to Bunq. This is part of setting up the BUNQ API 
 
## BUNQ_API_KEY
The API Key for BUNQ. 

## BUNQ_DEVICE_KEY
See (Authentication)[https://doc.bunq.com/#/authentication]

## TICKUSERNAME
Your Tick Tick Username 

## TICKPASSWORD
Your Tick Tick Password
