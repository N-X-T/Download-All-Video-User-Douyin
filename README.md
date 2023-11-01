# Don't support download video make from image -> only download music
# New Feature:
- The name of the downloaded video is of the form: max_cursor-id-description.mp4 (first video is downloaded is newest video in douyin, download from new to old)
- Get the "id" and enter the prompt to download new videos start from "id"
- Get the "max_cursor" in lasted video is downloaded and enter the prompt to continue download old video

# How to use:
-Open link of user, example: https://www.douyin.com/user/MS4wLjABAAAA5A-hCBCTdv102baOvaoZqg7nCIW_Bn_YBA0Aiz9uYPY

-Open DevChrome(F12)

-Set delay in milisecond at: "await waitforme(1000);" (optional)

-Paste code to console;

-Enter "id" of video, fill "0" if want to download all video;

-View process in console;

-If have any bug, create Issues!
