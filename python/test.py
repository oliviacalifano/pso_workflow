#!/usr/bin/env python3

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

partners_list = []	
email = ""

def read_in_links():
	with open('partners.json') as data_file:
			data = json.load(data_file)
			
	for partner in data["partners"]:
		if ("enabled" not in data["partners"][partner]) or (data["partners"][partner]["enabled"]["mathtag"]==False):
			pass
		else:
			print(partner,",",data["partners"][partner]["common_name"])
		
read_in_links()