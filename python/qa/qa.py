#!/usr/local/bin/python3.6

import http.client, json
import re
import datetime, pytz
import sys
import pandas as pd

from qa_helper import toDate, get_from_smartsheet, get_from_t1_meta, smartsheet_lookup, get_from_t1_reports, send_email
import secret

password_api = secret.login['password_api']
password_email = secret.login['password_email']

#authentication headers
conn = http.client.HTTPSConnection("api.smartsheet.com")
login = "https://api.mediamath.com/api/v2.0/login"
payload = "user=ocalifano&password="+password_api+"&api_key=zknzxverexqwf5epb53z87ae"

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
rows_initialize = smartsheet_lookup(conn,headers_smartsheet)

for x in rows_initialize:
	campaign_id = x["cells"][1]["value"]
	if "value" in x["cells"][2]: supply = str(x["cells"][2]["value"]).split(",")
	if "value" in x["cells"][4]: geo = str(x["cells"][4]["value"]).split(",")
	if "value" in x["cells"][6]: sitelist = str(x["cells"][6]["value"]).split(",")

	#print account and current time to log file
	print(campaign_id,pytz.utc.localize(datetime.datetime.utcnow()))

	# connect to mm execution and management api
	strat_ids,strat_names = get_from_t1_meta(login, headers_login, payload, headers_get, campaign_id)

	# #connect to activity tracker sheet
	# campaign_ids, s_status, s_budgets, s_starts, s_ends, s_metric = get_from_smartsheet(conn, headers_smartsheet, sheet, id, budget, status, start, end, metric, email)

	# #create data frame with smartsheet details
	df = pd.DataFrame(columns=['Strategy Name','Supply','Geo','Sitelist'],index=strat_ids)
	df.columns.names = ['Strategy ID']
	df['Strategy Name'] = strat_names

	sitelist_check(login, headers_login, payload, headers_get, df.index.values)
	

	# #only output rows that are Live or Launching Next
	# if status != "":
		# df = df[df['Smartsheet Status'].isin(["Live","Launching Next"])]	
			
	# del df['Smartsheet Status']
	


		# for item in info:
			# id = item["id"]
			# df.loc[str(id),'Advertiser ID'] = item["advertiser"]["id"]
			# df.loc[str(id),'Advertiser Name'] = item["advertiser"]["name"]
			# df.loc[str(id),'Campaign Name'] = item["name"]
			# df.loc[str(id),'Campaign Status'] = item["status"]
			# budget_string = str(item["total_budget"][0]["value"])
			# result = round(float(re.sub('[^0-9.]','', budget_string)), 2)
			# df.loc[str(id),'T1 Budget'] = result
			# df.loc[str(id),'T1 Start Date'] = str(toDate(item["start_date"],item["zone_name"])).split('T')[0]
			# df.loc[str(id),'T1 End Date'] = str(toDate(item["end_date"],item["zone_name"])).split('T')[0]
	
		# if metric != "":
			# for camp_id in df.index.values:
				# cpm = get_from_t1_reports(login, headers_login, payload, headers_get, camp_id)	
				# df.loc[camp_id,'T1 CPM'] = '{:.2f}'.format(round(float(cpm), 2))

		# #df['Smartsheet Budget'] = df['Smartsheet Budget'].astype('float64')
		# #df['T1 Budget'] = df['T1 Budget'].astype('float64')
		# df['Smartsheet CPM'] = df['Smartsheet CPM'].astype('float64')
		# df['T1 CPM'] = df['T1 CPM'].astype('float64')	

		# #pandas style functions
		# def metric_color(val):
			# if val['Smartsheet CPM'] < val['T1 CPM']:
				# color = 'red'
			# else: color = 'green'
			# return ['color: black','color: %s' % color]	

		# def budget_color(val):
			# if val['Smartsheet Budget'] != val['T1 Budget']:
				# color = 'red'
			# else: color = 'green'
			# return ['color: black','color: %s' % color]

		# def start_color(val):
			# if val['Smartsheet Start Date'] != val['T1 Start Date']:
				# color = 'red'
			# else: color = 'green'
			# return ['color: black','color: %s' % color]	

		# def end_color(val):
			# if val['Smartsheet End Date'] != val['T1 End Date']:
				# color = 'red'
			# else: color = 'green'
			# return ['color: black','color: %s' % color]

		# #style the data frame
		# da = df.style
		# da.apply(budget_color, subset=['Smartsheet Budget', 'T1 Budget'],axis=1)
		# da.set_table_attributes('border="1"')
		# da.format({'Smartsheet Budget': '{0:.2f}', 'T1 Budget': '{0:.2f}'})

		# #dont output certain columns
		# if start == "":
			# del df["Smartsheet Start Date"]
			# del df["T1 Start Date"]
		# else:
			# da.apply(start_color, subset=['Smartsheet Start Date', 'T1 Start Date'],axis=1)

		# if end == "":	
			# del df['Smartsheet End Date']
			# del df['T1 End Date']
		# else:
			# da.apply(end_color, subset=['Smartsheet End Date', 'T1 End Date'],axis=1)
			
		# if metric == "":
			# del df['Smartsheet CPM']
			# del df['T1 CPM']
		# else:
			# da.apply(metric_color, subset=['Smartsheet CPM', 'T1 CPM'],axis=1)
		
		# #reformat table for email to include scrollbar
		# da.set_properties(subset=['Campaign Name'],**{'width': '250px'})
		# da.set_properties(subset=df.columns.values,**{'text-align': 'left','white-space': 'nowrap'})
		
		# #tester email
		# #send_email(account,"ocalifano@mediamath.com",password_email,da)
		# send_email(account,email,password_email,da)
		
