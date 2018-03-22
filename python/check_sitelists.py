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

#connect to MM api	
login = "https://api.mediamath.com/api/v2.0/login"
ca_strats = "https://api.mediamath.com/api/v2.0/strategies/limit/campaign=389498"

payload = "user=ocalifano&password=Cap2albio&api_key=zknzxverexqwf5epb53z87ae"

headers_login = {
    'cache-control': "no-cache",
    'postman-token': "02f1f521-7fae-1398-25cd-0a46f6ce81cb",
    'content-type': "application/x-www-form-urlencoded"
    }

headers_get = {
    'Accept' : "application/vnd.mediamath.v1+json"
    }

r_auth = requests.request("POST", login, data=payload, headers=headers_login)
c = r_auth.cookies
r_camp = requests.request("GET", ca_strats, headers=headers_get, cookies=c)
r = r_camp.content

json_string = str(r_camp.content, 'utf8')
jdata = json.loads(json_string)
j = jdata["data"]

count = jdata["meta"]["total_count"]
count = math.floor(count/100)

ca_strat_id = []
ca_strat_name = []
#ca_strat_status = []
ca_strat_transparent = []

for x in range(0, count+1):
	if x == 0:
		offset = str(x)
	else:
		offset = str(x)+"00"
	
	url = "https://api.mediamath.com/api/v2.0/strategies/limit/campaign=389498?q=status%3d%3d1&full=*&page_offset="+offset
	r_auth = requests.request("POST", login, data=payload, headers=headers_login)
	c = r_auth.cookies
	r_camp = requests.request("GET", url, headers=headers_get, cookies=c)
	r = r_camp.content
	
	json_string = str(r_camp.content, 'utf8')
	jdata = json.loads(json_string)
	print(jdata)
	j = jdata["data"]
	
	for item in j:
		#global id
		id = item["id"]
		name = item["name"]
		status = item["status"]
		transparent = item["site_restriction_transparent_urls"]
		ca_strat_id.append(int(id))
		ca_strat_name.append(name)
		#ca_strat_status.append(status)
		ca_strat_transparent.append(transparent)

#print(s_budgets)
df = pd.DataFrame(columns=['ID','Name','Whitelist?', "Transparent URLs", "Output"],index=ca_strat_id)
pd.set_option('display.float_format', lambda x: '%.2f' % x)		
	
df["ID"] = ca_strat_id
df["Name"] = ca_strat_name
#df["Status"] = ca_strat_status
df["Transparent URLs"] = ca_strat_transparent
print(df)	

for strat in ca_strat_id:
	url = "https://api.mediamath.com/api/v2.0/strategies/"+str(strat)+"/site_lists?q=assigned==1%26id==121480"
	r_auth = requests.request("POST", login, data=payload, headers=headers_login)
	c = r_auth.cookies
	r_camp = requests.request("GET", url, headers=headers_get, cookies=c)
	r = r_camp.content
	
	json_string = str(r_camp.content, 'utf8')
	jdata = json.loads(json_string)
	j = jdata["data"]
	
	wl_count = jdata["meta"]["total_count"]
	
	if wl_count == 1:
		df.loc[strat,'Whitelist?'] = True
	else:
		df.loc[strat,'Whitelist?'] = False

df["Output"] = np.where(((df['Whitelist?'] == False) | (df['Transparent URLs'] == False)), True, False) 	


df = df[df['Output'] == True]
del df['Output']	
	
pd.set_option('display.max_colwidth',100)	
		
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

username = 'ocalifano@mediamath.com'
from_addr = 'ocalifano@mediamath.com'
to_addrs = 'ocalifano@mediamath.com'
password = 'Eva3angelina!'
msg = MIMEMultipart()
msg['Subject'] = "IBM - Alert: Whitelist Check"
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