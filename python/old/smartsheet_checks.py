#!/usr/local/bin/python3.6

import http.client
import json
import requests
import math
import re
from decimal import Decimal
import sys

import pandas as pd
import numpy as np


conn = http.client.HTTPSConnection("api.smartsheet.com")

headers = {
    'authorization': "Bearer 1rzbxeq3twe85nqbgdcraeaaqw",
    'cache-control': "no-cache",
    'postman-token': "162c5624-087c-af7c-60fe-a18934a777f2"
    }

#local
if sys.argv[1] == "local":
	print(sys.argv[1])
	to_addrs = "ocalifano@mediamath.com"
	sheet = "8607841553540996"
	email_subject = "IBM Alert - Local Markets - Budget Check (T1 vs Smartsheet)"
	col_id = 1
	col_budget = 2
	col_live = 3

#na
if sys.argv[1] == "na":
	print(sys.argv[1])
	to_addrs = "ocalifano@mediamath.com"
	#sheetQ4 = "3652797913687940"
	sheet = "1406670241851268"
	email_subject = "IBM Alert - NA - Budget Check (T1 vs Smartsheet)"
	col_id = 1
	col_budget = 3
	col_live = 4

#saatchi
if sys.argv[1] == "saatchi":
	print(sys.argv[1])
	to_addrs = "kwhelan@mediamath.com,ocalifano@mediamath.com"
	sheet = "3209589500995460"	
	email_subject = "SaatchiX Alert - Budgets - T1 vs Smartsheet"
	col_id = 3
	col_budget = 9
	col_live = 12
	
conn.request("GET", "/2.0/sheets/"+sheet, headers=headers)

res = conn.getresponse()
data = res.read()

y=json.loads(data)

d = {}
rows = y["rows"]

global campaign_ids
campaign_ids = []
global s_budgets
s_budgets = []
for x in rows:
	global camp_id
	camp_id = 0

	if "value" in x["cells"][col_id] and "value" in x["cells"][col_live]:
		if x["cells"][col_live]["value"] == "Live" or x["cells"][col_live]["value"] == "Launching Next":
			camp_id = str(x["cells"][col_id]["value"])
			#print(camp_id)
			camp_id = int(float(camp_id))
			d[camp_id] = 0
			campaign_ids.append(str(camp_id))
			if "value" in x["cells"][col_budget]:
				s_budget = str(x["cells"][col_budget]["value"])
				#print(s_budget)
				result = round(float(re.sub('[^0-9.]','', s_budget)),2)
				#result = float(result)
				#print(result)
				d[camp_id] = result
				s_budgets.append(result)
			else:
				d[camp_id] = 0
				s_budgets.append(0)
			
#print(s_budgets)
df = pd.DataFrame(columns=['Advertiser ID','Advertiser Name','Campaign ID','Campaign Name','Smartsheet Budget','T1 Budget'],index=campaign_ids)
pd.set_option('display.float_format', lambda x: '%.2f' % x)
#df.columns.name = 'Campaign ID'
#print(type(s_budgets))
df['Smartsheet Budget'] = s_budgets
#print(df)
	
	
#connect to MM api	
login = "https://api.mediamath.com/api/v2.0/login"
campaigns = "https://api.mediamath.com/api/v2.0/campaigns?q=("+','.join(campaign_ids)+")&full=*"
camp_test = "https://api.mediamath.com/api/v2.0/campaigns?q=(421588,383975)&full=*"

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
		df.loc[str(id),'T1 Budget'] = float(item["total_budget"][0]["value"])

df['match?'] = (df['Smartsheet Budget'] == df['T1 Budget'])


#if sys.argv[1] == "local" or sys.argv[1] == "na":
	#only output rows that aren't a match
	#df = df[df['match?'] == False]	
	#don't output the match column
	#del df['match?']
	

#df.to_csv('budget_check.csv', index=False)
df['T1 Budget'] = df['T1 Budget'].astype('float64')

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

username = 'ocalifano@mediamath.com'
from_addr = 'ocalifano@mediamath.com'
#to_addrs = 'ocalifano@mediamath.com'
password = 'Eva2angelina!'
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