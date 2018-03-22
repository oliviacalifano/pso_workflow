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
def smartsheet_lookup(arg,conn,headers_smartsheet):
	conn.connect()
	conn.request("GET", "/2.0/sheets/8865616196069252", headers=headers_smartsheet)
	rows_lookup = conn.getresponse()
	next = rows_lookup.read()
	
	r= json.loads(next)["rows"]
	
	for x in r:
		if x["cells"][0]["value"] == arg:
			sheet, id, budget, status, start, end, metric = [int(x["cells"][i]["value"]) if "value" in x["cells"][i] else "" for i in range(1,8)]
			email = x["cells"][8]["value"] if "value" in x["cells"][8] else ""
			return sheet, id, budget, status, start, end, metric, email

def get_from_smartsheet(conn, headers_smartsheet, sheet, id, budget, status, start, end, metric, email):
	print(sheet, id, budget, status, start, end, metric, email)
	conn.request("GET", "/2.0/sheets/"+str(int(sheet)), headers=headers_smartsheet)
	rows_tracker = json.loads(conn.getresponse().read())["rows"]
	
	s_ids, s_status, s_budgets, s_starts, s_ends, s_metric = ([] for i in range(6))
	for x in rows_tracker:
		
		if "value" in x["cells"][id] and "value" in x["cells"][status]:
			s_ids.append(str(int(x["cells"][id]["value"])))
			s_status.append(str(x["cells"][status]["value"]))
			if "value" in x["cells"][budget]:
				s_budget = str(x["cells"][budget]["value"])
				result = round(float(re.sub('[^0-9.]','', s_budget)),2)
				s_budgets.append(result)
			else:
				s_budgets.append(0)
			if start != "":
				if "value" in x["cells"][start]:
					s_starts.append(str(x["cells"][start]["value"]))
				else:
					s_starts.append("nan")
			else: s_starts.append("nan")	
			if end != "":		
				if "value" in x["cells"][end]:
					s_ends.append(str(x["cells"][end]["value"]))
				else:
					s_ends.append("nan")
			else: s_ends.append("nan")		
			if metric != "":		
				if "value" in x["cells"][metric]:
					s_metric.append('{:.2f}'.format(round(float(x["cells"][metric]["value"]), 2)))
				else:
					s_metric.append("nan")
			else: s_metric.append("nan")

	return 	s_ids,s_status,s_budgets,s_starts,s_ends,s_metric	
	
# connect to MM api
def get_from_t1_meta(login, headers_login, payload, headers_get, campaign_ids):	
	campaigns = "https://api.mediamath.com/api/v2.0/campaigns?q=("+','.join(campaign_ids)+")&full=*"
	r_auth = requests.request("POST", login, data=payload, headers=headers_login)
	c = r_auth.cookies
	r_camp = requests.request("GET", campaigns, headers=headers_get, cookies=c)
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
		r_auth = requests.request("POST", login, data=payload, headers=headers_login)
		c = r_auth.cookies
		r_camp = requests.request("GET", url, headers=headers_get, cookies=c)
		r = r_camp.content
		
		json_string = str(r_camp.content, 'utf8')
		jdata = json.loads(json_string)
		j = jdata["data"]
	return 	j
	
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