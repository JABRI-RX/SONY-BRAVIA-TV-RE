import requests

def getContentList():
    url_host = "http://192.168.179.1/p/cgi-bin/photo_share_cgi.cgi"
    headers = {
        "Host": "192.168.179.1",
        "Content-Length": "110",
        "Accept-Language": "en-US",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36",
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Origin": "http://192.168.179.1",
        "Referer": "http://192.168.179.1/p/tl.html",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
    }
    data = {
        "id":33,
        "method":"getContentList",
        "params":[
                	{	
                    "count":50,
                    "index":0,
                    "type":["photo","video"]
                    }
            ],
        "version":"1.0"
        }
    req = requests.post(url=url_host,data=data,headers=headers)
    print(req.text)

getContentList()