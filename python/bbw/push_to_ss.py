import http.client, json
import sys 
sys.path.append('..')
import secret

ss_key = secret.login['ss_key']

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

list = {}

f = open('report.txt', 'r')
next(f)
for line in f:
	if line != "\n" and line != "":
		print(line, end='')
		arr = line.strip("\n").split(",")
		list[arr[0]] = arr
f.close()
		
update = {}

conn.connect()
conn.request("GET", "/2.0/sheets/5834179960170372", headers=header_ss_get)
rows_initialize = json.loads(conn.getresponse().read())["rows"]

def update(body):
	conn.connect()
	conn.request('PUT', '/2.0/sheets/5834179960170372/rows', body, headers=header_ss_post)
	print(json.loads(conn.getresponse().read()))
	

for x in rows_initialize:
	if "value" in x["cells"][0]:
		if x["cells"][0]["value"] in list:
			index = list[x["cells"][0]["value"]]
			print(index)
			row = x["id"]
			col_a = x["cells"][1]["columnId"]
			col_b = x["cells"][2]["columnId"]
			col_c = x["cells"][3]["columnId"]
			body = [{"id":row,"cells":[{"columnId":col_a,"value": index[1]},{"columnId":col_b,"value": index[2]},{"columnId":col_c,"value": index[3]}]}]
			update(json.dumps(body))
		
	
