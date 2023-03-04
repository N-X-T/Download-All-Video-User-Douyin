var getid=async function(sec_user_id,max_cursor){
	var res=await fetch("https://www.douyin.com/aweme/v1/web/aweme/post/?device_platform=webapp&aid=6383&channel=channel_pc_web&sec_user_id="+sec_user_id+"&max_cursor="+max_cursor, {
	  "headers": {
		"accept": "application/json, text/plain, */*",
		"accept-language": "vi",
		"sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Microsoft Edge\";v=\"108\"",
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": "\"Windows\"",
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-origin"
	  },
	  "referrer": "https://www.douyin.com/user/MS4wLjABAAAA5A-hCBCTdv102baOvaoZqg7nCIW_Bn_YBA0Aiz9uYPY",
	  "referrerPolicy": "strict-origin-when-cross-origin",
	  "body": null,
	  "method": "GET",
	  "mode": "cors",
	  "credentials": "include"
	});
	res=await res.json();
	return res;
}

var download=async function(url, aweme_id, desc){
	var file_name = aweme_id + "-" + desc + ".mp4";
	var data=await fetch(url, {
  "headers": {
    "accept": "*/*",
    "accept-language": "vi,en-US;q=0.9,en;q=0.8",
    "range": "bytes=0-",
    "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Microsoft Edge\";v=\"108\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "video",
    "sec-fetch-mode": "cors",
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

var waitforme=function(millisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, millisec);
    })
}

var run=async function(){
	var first=JSON.parse(decodeURIComponent(document.getElementById("RENDER_DATA").textContent));
	for(var key in first)
	    try{
		var data=first[key]['post']['data'];
		var result=[];
		for(var i in data){
			result.push(["https:"+data[i]['video']['playAddr'][0]['src'],data[i]['awemeId'],data[i]['desc']]);
		}
		var hasMore=first[key]['post']['hasMore'];
		var sec_user_id=first[key]['user']['user']['secUid'];
		var max_cursor=first[key]['post']['maxCursor'];
		while(hasMore==1){
			var moredata=await getid(sec_user_id,max_cursor);
			hasMore=moredata['has_more'];
			max_cursor=moredata['max_cursor'];
			for(var i in moredata['aweme_list']){
				if(moredata['aweme_list'][i]['video']['play_addr']['url_list'][0].startsWith("https"))
					result.push([moredata['aweme_list'][i]['video']['play_addr']['url_list'][0],moredata['aweme_list'][i]['aweme_id'],moredata['aweme_list'][i]['desc']]);
				else
					result.push([moredata['aweme_list'][i]['video']['play_addr']['url_list'][0].replace("http","https"),moredata['aweme_list'][i]['aweme_id'],moredata['aweme_list'][i]['desc']]);
				console.clear();
				console.log("Number of videos: "+result.length);
			}
		}
		for(var i in result){
			await waitforme(1000);
			try{download(result[i][0],result[i][1],result[i][2]);}catch{}
		}
		//console.log(result);
	    }catch{}
}
run();
