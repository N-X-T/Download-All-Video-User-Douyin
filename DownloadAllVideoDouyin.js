async function API_CALL(max_cursor, uid){
	var API_ENDPOINT = "https://www.iesdouyin.com/web/api/v2/aweme/post/?sec_uid="+uid+"&count=10&max_cursor="+max_cursor;
	var data=await fetch(API_ENDPOINT, {
						  "headers": {
								'accept': 'application/json',
								'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko)'
							},
						  "method": "GET"
						});
	data=await data.json();
	return data;
}
async function get_data(uid, max_cursor){
	var data=[];
    var data_json = await API_CALL(max_cursor, uid);
	try{
		var aweme_list = data_json["aweme_list"];
		for(var i in aweme_list){
			src = aweme_list[i].video.play_addr.url_list[0].replace("http","https");
			//item["video"]["play_addr"]["url_list"][-1]
            desc = aweme_list[i].desc;
            aweme_id = aweme_list[i]["aweme_id"];
            data.push({
                "id": aweme_id,
                "src": src,
                "desc": desc
            })
		}
		if(data_json["has_more"])
			return [data, data_json['max_cursor']];
		 else return [data, 0];
	} catch(e){}
	
}
async function download(url, aweme_id, desc){
	var file_name = aweme_id + "-" + desc + ".mp4";
	var data=await fetch(url, {
  "headers": {
    "accept": "*/*",
    "accept-language": "vi,en-US;q=0.9,en;q=0.8",
    "range": "bytes=0-",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Microsoft Edge\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "video",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "cross-site"
  },
  "referrer": "https://www.douyin.com/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "omit"
});
	data=await data.blob();
	var a = document.createElement("a");
	a.href = window.URL.createObjectURL(data);
	a.download = file_name;
	a.click();
}
async function run(){
	var uid = window.location.href.replace("https://www.douyin.com/user/","");
	var max_cursor = 0;
    var all_data = [];
	while(1){
		var t =await get_data(uid, max_cursor);
		all_data.push(t[0]);
		if(!t[1])break;
	}
	for(var i in all_data){
		for(var j in all_data[i]){
			try{
				download(all_data[i][j]["src"], all_data[i][j]["id"], all_data[i][j]["desc"]);
			}catch(e){}
		}
	}
}
run();
