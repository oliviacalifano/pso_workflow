#!/usr/local/bin/python

import json
import requests
import csv
import untangle
from xml.dom import minidom
import StringIO
from datetime import datetime, timedelta




spendCap = 0
header = "" 
list = []
campaigns = []

def get(x):
	names1 = ""
	names2= ""
	obj = ""
	
	camp = str(x)
	url="https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/" + camp
	r=requests.get(url, cookies=c.cookies)
	obj = untangle.parse(r.content)
	
	names1 = ','.join([prop['name'] for prop in obj.result.entity.prop])
	names2 = ','.join([prop['value'] for prop in obj.result.entity.prop])

	names1 = names1.split(',')
	names2 = names2.split(',')
	
	index1 = names1.index('spend_cap_enabled')
	names2 = names2[index1]
	
	if names2 == '1':
		getSpendCap(x)
	else: return 0
		

def getSpendCap(x):
	names1 = ""
	names2= ""
	obj = ""
	
	camp = str(x)
	url="https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/" + camp
	r=requests.get(url, cookies=c.cookies)
	obj = untangle.parse(r.content)
	
	names1 = ','.join([prop['name'] for prop in obj.result.entity.prop])
	names2 = ','.join([prop['value'] for prop in obj.result.entity.prop])
	
	names1 = names1.split(',')
	names2 = names2.split(',')
	
	index1 = names1.index('spend_cap_amount')
	global spendCap
	spendCap = names2[index1]
	#print spendCap
	
	
	

def spend(x, date):
	camp = str(x)
	print camp
	url = "https://adroit-tools.mediamath.com/t1/reporting/v1/std/pulse?start_date=" + date + "&time_rollup=all&filter=campaign_id%3D" + camp + "&end_date=" + date + "&dimensions=advertiser_name%2Cadvertiser_id%2Ccampaign_name%2Ccampaign_id&metrics=total_spend"
	r=requests.get(url, cookies=c.cookies)
	str1 = r.content

	s1 = str1[0:87] + ", spend_cap_amount"
	global header
	header = s1
	s2 = str1[88:len(str1)]
	s2 = s2.strip()

	global spendCap 	

	spendCap = s2 + "," + spendCap
	list.append(spendCap)

def iterate(campaigns, date):
	for x in campaigns:
		if get(x) != 0:
			spend(x, date)

			
def campaigns(date):
	url="https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/limit/advertiser.agency.organization=100426?q=status%3D%3D1%26end_date%3E%3D" + date + "%26start_date%3C%3D" + date +"&sort_by=name"
	print url
	r=requests.get(url, cookies=c.cookies)
	obj = untangle.parse(r.content)
	
	#List of strategy names within the selected campaign
	campName = ','.join([entity['name'] for entity in obj.result.entities.entity])
	
	#list of strategy ids within the selected campaign 
	campId = ','.join([entity['id'] for entity in obj.result.entities.entity])
	
	#global campaigns
	campaigns = campId.split(',')
	return campaigns 	
	
def main():
	#campaigns = [214087 191279 215400]
	
	#campaigns = raw_input("Which campaigns? \n")
	#campaigns = campaigns.split()
	
	
	from datetime import date, timedelta
	date = date.today() - timedelta(1)
	date = str(date)
		
	camp = campaigns(date)
	iterate(camp, date)

	return list
	
	
	
main()


