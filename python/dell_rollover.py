#!/usr/local/bin/python3.6

import http.client
import json
import requests
import math
import datetime, pytz
import pandas as pd
import sys

import secret

password_api = secret.login['password_api']
password_email = secret.login['password_email']
api_key = secret.login['api_key']

#function to make datetime objects timezone aware
def toDate (date,zone):
	date_new = date.split("+", 1)[0]	
	utc_now = pytz.utc.localize(datetime.datetime.strptime(date_new, "%Y-%m-%dT%H:%M:%S" ))
	pst_now = utc_now.astimezone(pytz.timezone(zone))
	return pst_now.strftime("%Y-%m-%dT%H:%M:%S");

	
if sys.argv[1] == "brendan":
	print(sys.argv[1])
	to_addrs = "bmcnamara@mediamath.com, ocalifano@mediamath.com"
	org = "100789"

if sys.argv[1] == "amina":
	print(sys.argv[1])
	to_addrs = "awaltham@mediamath.com, ocalifano@mediamath.com"
	org = "100955"

if sys.argv[1] == "olivia":
	print(sys.argv[1])
	to_addrs = "ocalifano@mediamath.com"
	org = "101463"
	
#connect to MM api	
login = "https://api.mediamath.com/api/v2.0/login"

payload = "user=ocalifano&password="+password_api+"&api_key="+api_key
headers = {
    'cache-control': "no-cache",
    'postman-token': "02f1f521-7fae-1398-25cd-0a46f6ce81cb",
    'content-type': "application/x-www-form-urlencoded",
	'Accept' : "application/vnd.mediamath.v1+json"
    }

#camps = ["432085","432498"]	

#get the dell campaigns
camps = []
url = "https://api.mediamath.com/api/v2.0/campaigns/limit/advertiser.agency.organization="+org+"?&q=status%3d%3dtrue"
r_auth = requests.request("POST", login, data=payload, headers=headers)
c = r_auth.cookies
r_camp = requests.request("GET", url, headers=headers, cookies=c)
r = r_camp.content
json_string = str(r_camp.content, 'utf8')
jdata = json.loads(json_string)
j = jdata["data"]

#get additional dell campaigns with page offset
count = jdata["meta"]["total_count"]
count = math.floor(count/100)

for x in range(0, count+1):
	if x == 0:
		offset = str(x)
	else:
		offset = str(x)+"00"
	url = "https://api.mediamath.com/api/v2.0/campaigns/limit/advertiser.agency.organization="+org+"?&q=status%3d%3dtrue&page_offset="+offset
	#print(url)
	r_auth = requests.request("POST", login, data=payload, headers=headers)
	c = r_auth.cookies
	r_camp = requests.request("GET", url, headers=headers, cookies=c)
	r = r_camp.content
	
	json_string = str(r_camp.content, 'utf8')
	jdata = json.loads(json_string)
	j = jdata["data"]
	for item in j:
		id = item["id"]
		camps.append(str(id))
		
#create data frame for the report		
df = pd.DataFrame(columns=['CAMP_ID','ZONE','CURRENT_START','CURRENT_END','CURRENT_BUDGET','PREVIOUS_START','PREVIOUS_END','PREVIOUS_BUDGET','PREVIOUS_SPEND',"DIFF","NEW_CURRENT_BUDGET"],index=camps)
pd.set_option('display.float_format', lambda x: '%.2f' % x)
df['CAMP_ID'] = camps	

	
#retrieve budget flights	
for x in camps: 
	url = "https://api.mediamath.com/api/v2.0/campaigns/"+x+"/budget_flights?full=*&sort_by=-end_date"
	#print(url)
	r_auth = requests.request("POST", login, data=payload, headers=headers)
	c = r_auth.cookies
	r_camp = requests.request("GET", url, headers=headers, cookies=c)
	r = r_camp.content

	json_string = str(r_camp.content, 'utf8')
	jdata = json.loads(json_string)
	j = jdata["data"]

	previous_start = "na"
	previous_end = "na"	
	previous_budget = "na"
	for index, val in enumerate(j):
		if val['is_relevant'] == True:
			df.loc[str(x),"ZONE"] = val["zone_name"]
			df.loc[str(x),"CURRENT_START"] = toDate(val["start_date"],val["zone_name"])
			df.loc[str(x),"CURRENT_END"] = toDate(val["end_date"],val["zone_name"])
			df.loc[str(x),"CURRENT_BUDGET"] = val["total_budget"][0]["value"]
			if index+1 < len(j):
				df.loc[str(x),"PREVIOUS_START"] = toDate(j[index+1]["start_date"],j[index+1]["zone_name"])
				df.loc[str(x),"PREVIOUS_END"] = toDate(j[index+1]["end_date"],j[index+1]["zone_name"])
				df.loc[str(x),"PREVIOUS_BUDGET"] = j[index+1]["total_budget"][0]["value"]
			else:
				df.loc[str(x),"PREVIOUS_START"] = "na"
				df.loc[str(x),"PREVIOUS_END"] = "na"
				df.loc[str(x),"PREVIOUS_BUDGET"] = "na"
	
#only show campaigns with more than 1 flight	
df = df[df["PREVIOUS_START"] != "na"]
print(df)

for x in df.index:
	start = df.loc[str(x),"PREVIOUS_START"]
	end = df.loc[str(x),"PREVIOUS_END"]
	end_datetime = datetime.datetime.strptime(end, "%Y-%m-%dT%H:%M:%S")
	zone = df.loc[str(x),"ZONE"]
	now = pytz.utc.localize(datetime.datetime.utcnow())
	zone_now = now.astimezone(pytz.timezone(zone)).strftime("%Y-%m-%dT%H:%M:%S")
	zone_datetime = datetime.datetime.strptime(zone_now, "%Y-%m-%dT%H:%M:%S")
	
	diff = zone_datetime - end_datetime
	diff_sec = diff.total_seconds()
	
	#show flights that have been updated in the past day
	if diff_sec <= 604800:
		url = "https://api.mediamath.com/reporting/v1/std/performance?dimensions=campaign_id&metrics=total_spend&filter=campaign_id="+x+"&time_rollup=all&start_date="+start+"&end_date="+end
		#print(url)
		r_auth = requests.request("POST", login, data=payload, headers=headers)
		c = r_auth.cookies
		r_camp = requests.request("GET", url, headers=headers, cookies=c)
		r = r_camp.content
		json_string = str(r_camp.content, 'utf8')
		#print(json_string)
		info = json_string.split(",")
		spend = info[6].strip('\"')
		df.loc[str(x),"PREVIOUS_SPEND"] = float(spend)
		df.loc[str(x),"DIFF"] = df.loc[str(x),"PREVIOUS_BUDGET"] - df.loc[str(x),"PREVIOUS_SPEND"]
		df.loc[str(x),"NEW_CURRENT_BUDGET"] = df.loc[str(x),"CURRENT_BUDGET"] + df.loc[str(x),"DIFF"]
	else:
		df.loc[str(x),"PREVIOUS_SPEND"] = "No flight change"
		df.loc[str(x),"DIFF"] = "NA"
		df.loc[str(x),"NEW_CURRENT_BUDGET"] = "NA"	
	
print(df)

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

username = 'ocalifano@mediamath.com'
from_addr = 'ocalifano@mediamath.com'
password = password_email
msg = MIMEMultipart()
msg['Subject'] = "Dell Rollover Tool - Org: " + org
msg['From'] = from_addr
msg['To'] = to_addrs
body = MIMEText(df.to_html(index=False), 'html')
msg.attach(body)
server = smtplib.SMTP('smtp-mail.outlook.com:587')

server = smtplib.SMTP('smtp-mail.outlook.com', '587')
server.ehlo()
server.starttls()
server.ehlo()
server.login(username, password)
server.sendmail(from_addr, to_addrs.split(","), msg.as_string())
server.quit()