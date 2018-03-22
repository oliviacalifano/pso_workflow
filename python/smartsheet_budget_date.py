#!/usr/local/bin/python3.6

import http.client
import json
import requests
import math
import re
from decimal import Decimal
import datetime, pytz
import sys

import pandas as pd
import numpy as np

#function to make datetime objects timezone aware
def toDate (date,zone):
	date_new = date.split("+", 1)[0]	
	utc_now = pytz.utc.localize(datetime.datetime.strptime(date_new, "%Y-%m-%dT%H:%M:%S" ))
	pst_now = utc_now.astimezone(pytz.timezone(zone))
	return pst_now.strftime("%Y-%m-%dT%H:%M:%S");

def color_red(val):
	if val == "False": 
		color = 'red'
	else: 
		color = 'black'
	return 'color: %s' % color;

conn = http.client.HTTPSConnection("api.smartsheet.com")

headers = {
    'authorization': "Bearer 1rzbxeq3twe85nqbgdcraeaaqw",
    'cache-control': "no-cache",
    'postman-token': "162c5624-087c-af7c-60fe-a18934a777f2"
    }

#local
if sys.argv[1] == "local":
	print(sys.argv[1],pytz.utc.localize(datetime.datetime.utcnow()))
	to_addrs = "ocalifano@mediamath.com"
	#sheetQ4 = "8607841553540996"
	sheet = "8378840977303428"
	email_subject = "IBM Alert - Local Markets - T1 vs Smartsheet"
	col_id = 1
	col_budget = 3
	col_start = ""
	col_end = ""
	col_live = 4

#na
if sys.argv[1] == "na":
	print(sys.argv[1],pytz.utc.localize(datetime.datetime.utcnow()))
	to_addrs = "ocalifano@mediamath.com"
	#sheetQ4 = "3652797913687940"
	sheet = "1406670241851268"
	email_subject = "IBM Alert - NA - T1 vs Smartsheet"
	col_id = 1
	col_budget = 3
	col_start = ""
	col_end = ""
	col_live = 4

#saatchi
if sys.argv[1] == "saatchi":
	print(sys.argv[1],pytz.utc.localize(datetime.datetime.utcnow()))
	to_addrs = "kwhelan@mediamath.com,ocalifano@mediamath.com"
	#to_addrs = "ocalifano@mediamath.com"
	sheet = "3209589500995460"	
	email_subject = "SaatchiX Alert - T1 vs Smartsheet"
	col_id = 3
	col_budget = 9
	col_start = 10
	col_end = 11
	col_cpm = 12
	col_live = 13

#conagra
if sys.argv[1] == "conagra":
	print(sys.argv[1],pytz.utc.localize(datetime.datetime.utcnow()))
	to_addrs = "hsulaini@mediamath.com,ocalifano@mediamath.com"
	#to_addrs = "ocalifano@mediamath.com"
	sheet = "3585498561177476"	
	email_subject = "Conagra Alert - T1 vs Smartsheet"
	col_id = 8
	col_budget = 7
	col_start = 5
	col_end = 6
	col_live = 4

conn.request("GET", "/2.0/sheets/"+sheet, headers=headers)

res = conn.getresponse()
data = res.read()

y=json.loads(data)

d = {}
rows = y["rows"]

global campaign_ids
campaign_ids = []
global s_status
s_status = []
global s_budgets
s_budgets = []
global s_starts
s_starts = []
global s_ends
s_ends = []
for x in rows:
	global camp_id
	camp_id = 0

	if "value" in x["cells"][col_id] and "value" in x["cells"][col_live]:
		camp_id = str(x["cells"][col_id]["value"])
		camp_id = int(float(camp_id))
		campaign_ids.append(str(camp_id))
		s_status.append(str(x["cells"][col_live]["value"]))
		if "value" in x["cells"][col_budget]:
			s_budget = str(x["cells"][col_budget]["value"])
			result = round(float(re.sub('[^0-9.]','', s_budget)),2)
			print(result)
			s_budgets.append(result)
		else:
			s_budgets.append(0)
		if col_start != "":
			if "value" in x["cells"][col_start]:
				s_start = str(x["cells"][col_start]["value"])
				s_starts.append(s_start)
			else:
				s_starts.append("na")
		if col_end != "":		
			if "value" in x["cells"][col_end]:
				s_end = str(x["cells"][col_end]["value"])
				s_ends.append(s_end)
			else:
				s_ends.append("na")
			
#print(s_budgets)
df = pd.DataFrame(columns=['Advertiser ID','Advertiser Name','Campaign ID','Campaign Name','Campaign Status','Smartsheet Status','Smartsheet Budget','T1 Budget','Smartsheet Start Date','T1 Start Date','Smartsheet End Date','T1 End Date'],index=campaign_ids)
pd.set_option('display.float_format', lambda x: '%.2f' % x)

#df.columns.name = 'Campaign ID'
#print(type(s_budgets))
df['Smartsheet Status'] = s_status
df['Smartsheet Budget'] = s_budgets
if col_start != "":
	df['Smartsheet Start Date'] = s_starts
if col_end != "":
	df['Smartsheet End Date'] = s_ends
#print(df)
	
	
#connect to MM api	
login = "https://api.mediamath.com/api/v2.0/login"
campaigns = "https://api.mediamath.com/api/v2.0/campaigns?q=("+','.join(campaign_ids)+")&full=*"
print(campaigns)
print(','.join(campaign_ids))

payload = "user=ocalifano&password=Cap2albio&api_key=zknzxverexqwf5epb53z87ae"
headers = {
    'cache-control': "no-cache",
    'postman-token': "02f1f521-7fae-1398-25cd-0a46f6ce81cb",
    'content-type': "application/x-www-form-urlencoded"
	#'content-type': "text/html; charset=utf-8"
	}
headers2 = {
    'Accept' : "application/vnd.mediamath.v1+json"
    }

r_auth = requests.request("POST", login, data=payload, headers=headers)
c = r_auth.cookies
r_camp = requests.request("GET", campaigns, headers=headers2, cookies=c)
r = r_camp.content

json_string = str(r_camp.content, 'utf8')
jdata = json.loads(json_string)
print(jdata)
j = jdata["data"]

count = jdata["meta"]["total_count"]
count = math.floor(count/100)

for x in range(0, count+1):
	if x == 0:
		offset = str(x)
	else:
		offset = str(x)+"00"
	
	url = "https://api.mediamath.com/api/v2.0/campaigns?q=("+','.join(campaign_ids)+")&full=*&with=advertiser&page_offset="+offset
	r_auth = requests.request("POST", login, data=payload, headers=headers)
	c = r_auth.cookies
	r_camp = requests.request("GET", url, headers=headers2, cookies=c)
	r = r_camp.content
	
	json_string = str(r_camp.content, 'utf8')
	jdata = json.loads(json_string)
	j = jdata["data"]
	
	for item in j:
		#global id
		id = item["id"]
		df.loc[str(id),'Advertiser ID'] = item["advertiser"]["id"]
		df.loc[str(id),'Advertiser Name'] = item["advertiser"]["name"]
		df.loc[str(id),'Campaign ID'] = item["id"]
		df.loc[str(id),'Campaign Name'] = item["name"]
		df.loc[str(id),'Campaign Status'] = item["status"]
		df.loc[str(id),'T1 Budget'] = float(item["total_budget"][0]["value"])
		df.loc[str(id),'T1 Start Date'] = str(toDate(item["start_date"],item["zone_name"])).split('T')[0]
		df.loc[str(id),'T1 End Date'] = str(toDate(item["end_date"],item["zone_name"])).split('T')[0]

df['Budget Match?'] = (df['Smartsheet Budget'] == df['T1 Budget'])
df['Start Match?'] = (df['Smartsheet Start Date'] == df['T1 Start Date'])
df['End Match?'] = (df['Smartsheet End Date'] == df['T1 End Date'])

#only output rows that aren't a match
if sys.argv[1] == "local" or sys.argv[1] == "na":
	df = df[df['Budget Match?'] == False]	
	#don't output the match column
	del df['Budget Match?']
	
#only output rows that are Live or Launching Next
if sys.argv[1] == "local" or sys.argv[1] == "na" or sys.argv[1] == "saatchi":
	df = df[df['Smartsheet Status'].isin(["Live","Launching Next"])]	

#df.to_csv('budget_check.csv', index=False)
df['T1 Budget'] = df['T1 Budget'].astype('float64')

del df['Smartsheet Status']

#dont output certain columns
if sys.argv[1] == "local" or sys.argv[1] == "na":
	#don't output the date columns
	del df['Smartsheet Start Date']
	del df['Smartsheet End Date']
	del df['T1 Start Date']
	del df['T1 End Date']
	del df['Start Match?']
	del df['End Match?']

pd.set_option('display.max_colwidth',100)	
	
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

username = 'ocalifano@mediamath.com'
from_addr = 'ocalifano@mediamath.com'
#to_addrs = 'ocalifano@mediamath.com'
password = 'Eva3angelina!'
msg = MIMEMultipart()
msg['Subject'] = email_subject
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