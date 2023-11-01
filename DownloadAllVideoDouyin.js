var waitforme=function(millisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, millisec);
    })
}

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
	try{
	    res=await res.json();
	}catch(e){
		await waitforme(1000);
		res=await getid(sec_user_id,max_cursor);
		console.log(e);
	}
	return res;
}

var download=async function(max_cursor, url, aweme_id, desc){
	var file_name = max_cursor + "-" + aweme_id + "-" + desc + ".mp4";
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

var run=async function(){
	var result=[];
	var hasMore=1;
	var sec_user_id=location.pathname.replace("/user/","");
	var max_cursor=prompt("Enter max_cursor(Enter 0 if want to download all video):","");
	var download_from=prompt("Enter id video(Enter 0 if want to download all video):","");
	if(download_from==null || download_from=="" || max_cursor==null || max_cursor=="") {
		alert("Please, Enter id and max_cursor of video!");
		return;
	}
	while(hasMore==1){
		var moredata=await getid(sec_user_id,max_cursor);
		hasMore=moredata['has_more'];
		max_cursor=moredata['max_cursor'];
		for(var i in moredata['aweme_list']){
			if(moredata['aweme_list'][i]['aweme_id'] == download_from){
				hasMore=0;
				break;
			}
			if(moredata['aweme_list'][i]['video']['play_addr']['url_list'][0].startsWith("https"))
				result.push([moredata['aweme_list'][i]['video']['play_addr']['url_list'][0],moredata['aweme_list'][i]['aweme_id'],moredata['aweme_list'][i]['desc']]);
			else
				result.push([moredata['aweme_list'][i]['video']['play_addr']['url_list'][0].replace("http","https"),moredata['aweme_list'][i]['aweme_id'],moredata['aweme_list'][i]['desc']]);
			console.clear();
			console.log("Number of videos: "+result.length);
		}
		if(result.length>100){
			for(var i=0;i<result.length;i++){
				await waitforme(1000);
				try{download(max_cursor,result[i][0],result[i][1],result[i][2]);}catch{}
			}
			result = [];
		}
	}
	for(var i=0;i<result.length;i++){
		await waitforme(1000);
		try{download(max_cursor, result[i][0],result[i][1],result[i][2]);}catch{}
	}
}
run();
