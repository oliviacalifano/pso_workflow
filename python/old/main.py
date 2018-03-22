#!/usr/local/bin/python3.6

import http.client, json, requests
import math, re
from decimal import Decimal
import datetime, pytz
import sys

import pandas as pd
import numpy as np

from smartsheet_t1_lookup import toDate, get_from_smartsheet, get_from_t1_meta, smartsheet_lookup, get_from_t1_reports

#print time to log for better qa
print(sys.argv[1],pytz.utc.localize(datetime.datetime.utcnow()))

#authentication headers
conn = http.client.HTTPSConnection("api.smartsheet.com")
login = "https://api.mediamath.com/api/v2.0/login"
payload = "user=ocalifano&password=Cap2albio&api_key=zknzxverexqwf5epb53z87ae"

headers_smartsheet = {
	'authorization': "Bearer 1rzbxeq3twe85nqbgdcraeaaqw",
	'cache-control': "no-cache",
	'postman-token': "162c5624-087c-af7c-60fe-a18934a777f2"
	}
headers_login = {
	'cache-control': "no-cache",
	'postman-token': "02f1f521-7fae-1398-25cd-0a46f6ce81cb",
	'content-type': "application/x-www-form-urlencoded"
	}
headers_get = {
	'Accept' : "application/vnd.mediamath.v1+json"
	}	

#connect to smartsheet lookup sheet
sheet, id, budget, status, start, end, metric, email = smartsheet_lookup(sys.argv[1],conn,headers_smartsheet)

#connect to activity tracker sheet
campaign_ids, s_status, s_budgets, s_starts, s_ends, s_metric = get_from_smartsheet(conn, headers_smartsheet, sheet, id, budget, status, start, end, metric, email)

#create data frame with smartsheet details
df = pd.DataFrame(columns=['Campaign Name','Campaign Status','Advertiser ID','Advertiser Name','Smartsheet Status','Smartsheet Budget','T1 Budget','Smartsheet Start Date','T1 Start Date','Smartsheet End Date','T1 End Date','Smartsheet CPM','T1 CPM (CTD)'],index=campaign_ids)
df.columns.names = ['Campaign ID']
pd.set_option('display.max_colwidth', -1)

df['Smartsheet Status'] = s_status
df['Smartsheet Budget'] = s_budgets
df['Smartsheet Start Date'] = s_starts
df['Smartsheet End Date'] = s_ends
df['Smartsheet CPM'] = s_metric

#connect to mm execution and management api
info = get_from_t1_meta(login, headers_login, payload, headers_get, campaign_ids)

for item in info:
	id = item["id"]
	df.loc[str(id),'Advertiser ID'] = item["advertiser"]["id"]
	df.loc[str(id),'Advertiser Name'] = item["advertiser"]["name"]
	df.loc[str(id),'Campaign Name'] = item["name"]
	df.loc[str(id),'Campaign Status'] = item["status"]
	budget_string = str(item["total_budget"][0]["value"])
	result = '{:.2f}'.format(round(float(re.sub('[^0-9.]','', budget_string)), 2))
	df.loc[str(id),'T1 Budget'] = result
	df.loc[str(id),'T1 Start Date'] = str(toDate(item["start_date"],item["zone_name"])).split('T')[0]
	df.loc[str(id),'T1 End Date'] = str(toDate(item["end_date"],item["zone_name"])).split('T')[0]

if sys.argv[1] == "saatchi":
	for camp_id in campaign_ids:
		cpm = get_from_t1_reports(login, headers_login, payload, headers_get, camp_id)	
		df.loc[camp_id,'T1 CPM (CTD)'] = '{:.2f}'.format(round(float(cpm), 2))

#only output rows that are Live or Launching Next
if status != "":
	df = df[df['Smartsheet Status'].isin(["Live","Launching Next"])]

del df['Smartsheet Status']	

df['Smartsheet Budget'] = df['Smartsheet Budget'].astype('float64')
df['T1 Budget'] = df['T1 Budget'].astype('float64')
df['Smartsheet CPM'] = df['Smartsheet CPM'].astype('float64')
df['T1 CPM (CTD)'] = df['T1 CPM (CTD)'].astype('float64')	

#pandas style functions
def metric_color(val):
	if val['Smartsheet CPM'] < val['T1 CPM (CTD)']:
		color = 'red'
	else: color = 'green'
	return ['color: black','color: %s' % color]	

def budget_color(val):
	if val['Smartsheet Budget'] != val['T1 Budget']:
		color = 'red'
	else: color = 'green'
	return ['color: black','color: %s' % color]

def start_color(val):
	if val['Smartsheet Start Date'] != val['T1 Start Date']:
		color = 'red'
	else: color = 'green'
	return ['color: black','color: %s' % color]	

def end_color(val):
	if val['Smartsheet End Date'] != val['T1 End Date']:
		color = 'red'
	else: color = 'green'
	return ['color: black','color: %s' % color]		

print(df['Smartsheet Start Date'])
print(df['T1 Start Date'])
pd.set_option('display.max_colwidth', -1)
#style the data frame
d = [{'selector':'table', 'props': [('class', 'table-hover table-bordered table-striped')]}]
da = df.style
da.apply(budget_color, subset=['Smartsheet Budget', 'T1 Budget'],axis=1)
#da.set_properties(**{'background-color': 'white'}).set_properties(subset=['T1 Start Date','T1 End Date'], **{'width': '100px'}).set_table_attributes('border="1" class="dataframe table table-hover table-bordered"')
da.set_properties(**{'background-color': 'white'}).set_table_styles(d).set_table_attributes('border="1" class="table table-striped"')

print(da.render())

#dont output certain columns
if start == "":
	del df["Smartsheet Start Date"]
	del df["T1 Start Date"]
else:
	da.apply(start_color, subset=['Smartsheet Start Date', 'T1 Start Date'],axis=1)

if end == "":	
	del df['Smartsheet End Date']
	del df['T1 End Date']
else:
	da.apply(end_color, subset=['Smartsheet End Date', 'T1 End Date'],axis=1)
	
if metric == "":
	del df['Smartsheet CPM']
	del df['T1 CPM (CTD)']
else:
	da.apply(metric_color, subset=['Smartsheet CPM', 'T1 CPM (CTD)'],axis=1)
	
#send email
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
username = 'ocalifano@mediamath.com'
from_addr = 'ocalifano@mediamath.com'
to_addrs = 'ocalifano@mediamath.com'
password = 'Eva3angelina!'
msg = MIMEMultipart()
msg['Subject'] = sys.argv[1] + ": T1/Smartsheet Alert"
msg['From'] = from_addr
msg['To'] = to_addrs
body =  MIMEText(da.render(), 'html')
msg.attach(body)
server = smtplib.SMTP('smtp-mail.outlook.com:587')
server.ehlo()
server.starttls()
server.login(username, password)
server.sendmail(from_addr, to_addrs.split(","), msg.as_string())
server.quit()
	
	
	
	
	
