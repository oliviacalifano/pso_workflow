#!/usr/local/bin/python3.6

import http.client, json, requests
import math, re
import datetime, pytz

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication


#function to make datetime objects timezone aware
def toDate (date,zone):
	date_new = date.split("+", 1)[0]	
	utc_now = pytz.utc.localize(datetime.datetime.strptime(date_new, "%Y-%m-%dT%H:%M:%S" ))
	pst_now = utc_now.astimezone(pytz.timezone(zone))
	return pst_now.strftime("%Y-%m-%dT%H:%M:%S");

#connect to smartsheet lookup table
def smartsheet_lookup(conn,headers_smartsheet):
	conn.connect()
	conn.request("GET", "/2.0/sheets/1383706930767748", headers=headers_smartsheet)
	rows_initialize = json.loads(conn.getresponse().read())["rows"]
	return rows_initialize

# connect to MM api
def get_from_t1_meta(login, headers_login, payload, headers_get, campaign_id):	
	strategy_ids = []
	strategy_names = []
	strategies = "https://api.mediamath.com/api/v2.0/strategies/limit/campaign="+str(int(campaign_id))+"?q=status%3D%3D1"
	print(strategies)
	c = requests.request("POST", login, data=payload, headers=headers_login).cookies
	r = requests.request("GET", strategies, headers=headers_get, cookies=c)
	
	meta = json.loads(str(r.content, 'utf8'))["meta"]
	print(meta)
	data = json.loads(str(r.content, 'utf8'))["data"]
	print(data)
	count = meta["total_count"]
	count = math.floor(count/100)

	for x in data:
		strategy_ids.append(x["id"])
		strategy_names.append(x["name"])
	return strategy_ids,strategy_names

# connect to MM api
def sitelist_check(login, headers_login, payload, headers_get, strats):	
	strategy_ids = []
	strategy_names = []
	strategies = "https://api.mediamath.com/api/v2.0/strategies/"+str(strat)+"/site_lists?q=assigned==1%26id==121480"
	print(strategies)
	c = requests.request("POST", login, data=payload, headers=headers_login).cookies
	r = requests.request("GET", strategies, headers=headers_get, cookies=c)
	
	meta = json.loads(str(r.content, 'utf8'))["meta"]
	print(meta)
	data = json.loads(str(r.content, 'utf8'))["data"]
	print(data)
	count = meta["total_count"]
	count = math.floor(count/100)

	for x in data:
		strategy_ids.append(x["id"])
		strategy_names.append(x["name"])
	return strategy_ids,strategy_names
	
# pull CPM data for specified clients	
def get_from_t1_reports(login, headers_login, payload, headers_get, x):		
	url = "https://api.mediamath.com/reporting/v1/std/performance_aggregated?dimensions=campaign_id&metrics=total_spend_cpm&filter=campaign_id="+x+"&time_rollup=all&time_window=campaign_to_date&precision=2"
	r_auth = requests.request("POST", login, data=payload, headers=headers_login)
	c = r_auth.cookies
	r_camp = requests.request("GET", url, headers=headers_get, cookies=c)
	r = r_camp.content
	
	json_string = str(r_camp.content, 'utf8')
	cpm = json_string.split()[-1].split(",")[-1]
	return cpm

def send_email(account,to_addrs,password,da):
	username = 'ocalifano@mediamath.com'
	from_addr = 'ocalifano@mediamath.com'
	msg = MIMEMultipart()
	msg['Subject'] = account + ": T1/Smartsheet Alert"
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