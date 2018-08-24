#!/usr/bin/env python3

#https://stackoverflow.com/questions/20475552/python-requests-library-redirect-new-url/20475712#20475712
#1. pull in the sync links from partners.json file
#2. check if any cause a redirect that is either 1) too long 2) HTTPS to HTTP (no link along the redirect can be HTTP) or 4) returns a dead links
#3. output: alarm(information) function to email individuals

import requests
import time
import json
from pprint import pprint

import sys
sys.path.insert(0, "/home/ocalifano")


import secret
password_email = secret.login['password_email']
git_user = secret.login['git_user']
git_password = secret.login['git_password']

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

partners_list = []	
email = ""

def timer(url):
	global email
	try: 
		print(url)
		r = requests.get(url, timeout=4)
		if "https:" in url:
			https_to_http_check(r)
	except requests.exceptions.Timeout:
		email = email + url + " --> " + "request time > 4 sec" + "\n"
	except Exception as e: 
		print(e)
		email = email + url + " --> dead link " + "\n"

#TRY THE DEAD LINK A SECOND TIME?
		
def https_to_http_check(request):
	global email
	#request redirected
	if request.history:
		#check all redirects
		for resp in request.history:
			if "http:" in resp.url:
				email = email + resp.url + " --> illegal HTTPS to HTTP redirect \n"
		#check the final link
		if "http:" in request.url:
			email = email + request.url + " --> illegal HTTPS to HTTP redirect \n"
	#request not redirected
	else:
		pass

def send_email(text):
	mytext = "<br />".join(text.split("\n"))
	username = 'ocalifano@mediamath.com'
	from_addr = 'ocalifano@mediamath.com'
	msg = MIMEMultipart()
	msg['Subject'] = "Alert: Sync Partner Latency/Performance"
	msg['From'] = from_addr
	msg['To'] = 'ocalifano@mediamath.com'
	body =  MIMEText(mytext, 'html')
	msg.attach(body)
	server = smtplib.SMTP('smtp-mail.outlook.com:587')
	server.ehlo()
	server.starttls()
	server.login(username, password_email)
	server.sendmail(from_addr, msg['To'], msg.as_string())
	server.quit()

def read_in_links():

	response = requests.get('https://raw.githubusercontent.com/ocalifano/core-mt3/master/compat/config/sync/partners.json?token=AOohJlVQE3dulnb-VnECxyEOiVwXZO51ks5biHDIwA%3D%3D', auth=(git_user, git_password))
	data = json.loads(response.text)
	
	# with open('partners.json') as data_file:
			# data = json.load(data_file)
			
	for partner in data["partners"]:
		try: 
			if ("enabled" not in data["partners"][partner]) or (data["partners"][partner]["enabled"]["mathtag"]==False):
				pass
			else:
				partners_list.append(data["partners"][partner]["sync"]["outbound"]["urls"]["US"]["http"])
				partners_list.append(data["partners"][partner]["sync"]["outbound"]["urls"]["US"]["https"])
		except KeyError: pass
		
def main():
	global email 
	read_in_links()
		
	for link in partners_list:
		timer(link)
		#timer("https://us-u.openx.net/w/1.0/sd?id=536872786&val=[UUID]")

	if email != "":
		send_email(email)
	
	print(email)
 
if __name__== "__main__":
  main()