#!/usr/bin/env python3

import requests
import time
import json
from pprint import pprint
import socket

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

common_name_http = []
common_name_https = []
https = []
http = []

holder = []

email = ""
udp = ""
prefix = "dplat.sync_monitor.ewr"

class LinkObject():
	def __init__(self, name, link, alert, count_redirects, total_time, attempts, dead_links, slow, https_to_http):
		# Load up the information
		self.Name = name
		self.Link = link
		self.History = ""
		self.FinalURL = ""
		self.Alert = alert
		self.CountRedirects = count_redirects
		self.TotalTime = total_time
		self.Attempts = attempts
		self.DeadLinks = dead_links
		self.Slow = slow
		self.HttpsToHttp = https_to_http
		self.Message = []
		
	def Timer(self):
		try: 
			r = requests.get(self.Link, timeout=4)
			self.History = r.history
			self.FinalURL = r.url
			self.TotalTime = r.elapsed
		except requests.exceptions.Timeout:
			self.Alert = self.Alert+1
			self.Slow = self.Slow+1
			self.Message.append("request time > 4 sec")
		except Exception as e: 
			print(e)
			self.Alert = self.Alert+1
			self.DeadLinks = self.DeadLinks+1
			self.Message.append("dead link")	
		
	def HttpsToHttpCheck(self):
		#request redirected
		if self.History:
			redirects = self.History
			self.CountRedirects = len(redirects)
			#check all redirects
			for resp in redirects:
				if "http:" in resp.url:
					self.Alert = self.Alert+1
					self.HttpsToHttp = self.HttpsToHttp+1
					self.Message.append(resp.url + " --> illegal HTTPS to HTTP redirect")
			#check the final link
			if "http:" in self.FinalURL:
				self.Alert = self.Alert+1
				self.HttpsToHttp = self.HttpsToHttp+1
				self.Message.append(self.FinalURL + " --> illegal HTTPS to HTTP redirect")
		#request not redirected
		else:
			pass
			
	def __repr__(self):
		m = ""
		for x in self.Message:
			m = m + "\n" + x
		return "\n Link:%s Alert:%s Redirects:%s Time:%s Attempts:%s Dead:%s Slow:%s HttpsToHttp:%s" % (self.Link, self.Alert, self.CountRedirects, self.TotalTime, self.Attempts, self.DeadLinks, self.Slow, self.HttpsToHttp) + m		

	def __str__(self):
		return prefix+"."+str(self.Name)+".redirects"+":"+str(self.CountRedirects)+"|c \n"+prefix+"."+str(self.Name)+ ".attempts" + ":"+str(self.Attempts)+"|c \n" + prefix + "." + str(self.Name) + ".total_time" + ":"+str(self.TotalTime)+"|c \n" + prefix + "." + str(self.Name) + ".error.dead_link" + ":"+str(self.DeadLinks)+"|c \n" + prefix + "." + str(self.Name) + ".error.slow" + ":"+str(self.Slow)+"|c \n" + prefix + "." + str(self.Name) + ".error.https_http" + ":"+str(self.HttpsToHttp)+"|c \n"
				
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

def send_udp_packet(text):
	UDP_IP = ""
	UDP_PORT = 57475
	
	print("UDP target IP:", UDP_IP)
	print("UDP target port:", UDP_PORT)
	print("message:", text)

	sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # UDP
	sock.sendto(bytes(text, "utf-8"), (UDP_IP, UDP_PORT))
	
	
def read_in_links():
	#retrieve the current partner list from github
	response = requests.get('https://raw.githubusercontent.com/ocalifano/core-mt3/master/compat/config/sync/partners.json?token=AOohJlVQE3dulnb-VnECxyEOiVwXZO51ks5biHDIwA%3D%3D', auth=(git_user, git_password))
	data = json.loads(response.text)
			
	for partner in data["partners"]:
		try: 
			if ("enabled" not in data["partners"][partner]) or (data["partners"][partner]["enabled"]["mathtag"]==False):
				pass
			else:
				if "http" in data["partners"][partner]["sync"]["outbound"]["urls"]["US"]:
					http.append(data["partners"][partner]["sync"]["outbound"]["urls"]["US"]["http"])
					if "common_name" in data["partners"][partner]:
						common_name_http.append(data["partners"][partner]["common_name"]+"_http")
					else:
						common_name_http.append("na")	
				if "https" in data["partners"][partner]["sync"]["outbound"]["urls"]["US"]:
					https.append(data["partners"][partner]["sync"]["outbound"]["urls"]["US"]["https"])
					if "common_name" in data["partners"][partner]:
						common_name_https.append(data["partners"][partner]["common_name"]+"_https")
					else:
						common_name_https.append("na")
		except KeyError: pass

def main():
	global email 
	global udp
	global holder
	read_in_links()
	count_links = len(https)+len(http)
	for i in range(len(https)):
		newLink = LinkObject(common_name_https[i], https[i], 0, 0, 0, 0, 0, 0, 0)
		newLink.Attempts = newLink.Attempts + 1
		newLink.Timer()
		newLink.HttpsToHttpCheck()
		holder.append(newLink)
		if newLink.Alert > 0:
			email = email + "\n" + repr(newLink)
	for i in range(len(http)):
		newLink = LinkObject(common_name_http[i], http[i], 0, 0, 0, 0, 0, 0, 0)
		newLink.Attempts = newLink.Attempts + 1
		newLink.Timer()
		holder.append(newLink)
		if newLink.Alert > 0:	
			email = email + "\n" + repr(newLink)
	if len(holder) == count_links:
		for x in holder:
			if x.Alert > 0:
				udp = udp + str(x)
		print(email)
		if email != "":
			send_email(email)
	
if __name__== "__main__":
  main()
