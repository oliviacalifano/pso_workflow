import http.client, json, requests
import sys
sys.path.insert(0, "/home/ocalifano")
import secret
import pandas as pd
import datetime, pytz

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

ss_key = secret.login['ss_key']
password_api = secret.login['password_api']
password_email = secret.login['password_email']

login = "https://api.mediamath.com/api/v2.0/login"
payload = "user=ocalifano&password="+password_api+"&api_key=zknzxverexqwf5epb53z87ae"

conn = http.client.HTTPSConnection("api.smartsheet.com")

header_ss_get = {
	'authorization': "Bearer " + ss_key,
	'cache-control': "no-cache",
	'postman-token': "162c5624-087c-af7c-60fe-a18934a777f2"
	}
	
header_ss_post = {
	'authorization': "Bearer " + ss_key,
	'content-type': "application/json"
	}

headers_login = {
	'cache-control': "no-cache",
	'postman-token': "02f1f521-7fae-1398-25cd-0a46f6ce81cb",
	'content-type': "application/x-www-form-urlencoded"
	}

headers_get = {
	'Accept' : "application/vnd.mediamath.v1+json"
	}		

conn.connect()
conn.request("GET", "/2.0/sheets/3960066014504836", headers=header_ss_get)
rows_initialize = json.loads(conn.getresponse().read())["rows"]

print(pytz.utc.localize(datetime.datetime.utcnow()))

def update(body):
	conn.connect()
	conn.request('PUT', '/2.0/sheets/3960066014504836/rows', body, headers=header_ss_post)
	output = json.loads(conn.getresponse().read())
	#print(output)
	return output

def send_email(da):
	username = 'ocalifano@mediamath.com'
	from_addr = 'ocalifano@mediamath.com'
	to_addrs = 'seaworld@mediamath.com,ocalifano@mediamath.com'
	msg = MIMEMultipart()
	msg['Subject'] = "SeaWorld Spend Alert"
	msg['From'] = from_addr
	msg['To'] = to_addrs
	body =  MIMEText(da.to_html(index=False), 'html')
	msg.attach(body)
	server = smtplib.SMTP('smtp-mail.outlook.com:587')
	server.ehlo()
	server.starttls()
	server.login(username, password_email)
	server.sendmail(from_addr, to_addrs.split(","), msg.as_string())
	server.quit()
	
def get_from_t1_reports(x):		
	url = "https://api.mediamath.com/reporting/v1/std/performance?dimensions=organization_id&metrics=total_spend&filter=campaign_id="+str(x)+"&time_rollup=by_month&time_window=month_to_date&precision=2"
	r_auth = requests.request("POST", login, data=payload, headers=headers_login)
	c = r_auth.cookies
	r_camp = requests.request("GET", url, headers=headers_get, cookies=c)
	r = r_camp.content
	
	json_string = str(r_camp.content, 'utf8')
	#print(json_string)
	cpm = json_string.split()[-1].split(",")[-1]
	#print(cpm)
	if cpm == "total_spend": cpm = 0
	return cpm	

d = []
df = pd.DataFrame(columns=('Park','Current Budget','Spend','Pacing'))
for x in rows_initialize[1:]:
	try:
		if "value" in x["cells"][2]:
			row = x["id"]
			#print(row)
			camps = x["cells"][2]["value"]
			# print(camps)
			col_spend = x["cells"][3]["columnId"]
			#print(col_spend)
			spend = get_from_t1_reports(camps)
			#print(spend)
			body = [{"id":row,"cells":[{"columnId":col_spend,"value": float(spend)}]}]
			output = update(json.dumps(body))
			#print(output)
			key = []
			for a in output["result"][0]["cells"]:
				if ("displayValue" in a) and (a["columnId"] != 2785004494317444):	
					key.append(str(a["displayValue"]))
			df.loc[len(df)] = key
	except: 
		traceback.print_exc(file=sys.stdout)
		continue	
print(df)

print_time = [{"id":6907668728178564,"cells":[{"columnId":6162704214845316,"value":str(pytz.utc.localize(datetime.datetime.utcnow()))}]}]
update(json.dumps(print_time))
send_email(df)

