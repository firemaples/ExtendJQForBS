// ==UserScript==
// @name         B站-個人列表紀錄
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       You
// @match        http://space.bilibili.com/7075828/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var loopTime = 1000;
var addTextColor = "red";

if(location.href.match("^http://space.bilibili.com/7075828/#!/video")){
    //當在列表頁重整
    console.log("當在列表頁重整");
    waitingForListLoading();
}

$("div.s-left>a.video").click(function(){
    waitingForListLoading();
});



function waitingForListLoading(){
    if($("div.list-item").length > 0){
        console.log("loaded!");
        setTimeout(loadScores, loopTime);
    }else{
        console.log("loading...");
        setTimeout(waitingForListLoading, loopTime);
    }
}

function loadScores(){
    $("div.list-item").each(function(){
        var item = $(this);
        
        var videoId = item.data('aid');
        console.log("影片id:" + videoId);
        
        var divPlayTimes = item.find('span.play');
        var playTimes = divPlayTimes.text();
        if(playTimes.match("万$")){
            playTimes = playTimes.replace(/万/g,"") * 10000;
        }
        console.log("撥放數:" + playTimes);
        
        var divCommentTimes = item.find('span.comments');
        var commentTimes = divCommentTimes.text();
        console.log("彈幕數:" + commentTimes);
        
        if(typeof(Storage) !== "undefined") {
            var tagPlayTimes = "listItem_" + videoId + "_pt";
            var tagCommentTimes = "listItem_" + videoId + "_ct";
            
            //讀取紀錄
            if(localStorage[tagPlayTimes] != null){
                var lastPT = localStorage[tagPlayTimes];
                var add = playTimes - lastPT;
                
                console.log("前次撥放數:" + lastPT);
                if(add > 0){
                    divPlayTimes.css("color",addTextColor).css("font-weight","bolder");
                }
                divPlayTimes.text(playTimes + " (+" + add + ")");
            }
            
            if(localStorage[tagCommentTimes] != null){
                var lastCT = localStorage[tagCommentTimes];
                var add = commentTimes - lastCT;
                
                console.log("前次彈幕數:" + lastCT);
                if(add > 0){
                    divCommentTimes.css("color",addTextColor).css("font-weight","bolder");
                }
                divCommentTimes.text(commentTimes + " (+" + add + ")");
            }
            
            //儲存紀錄
            localStorage[tagPlayTimes] = playTimes;
            localStorage[tagCommentTimes] = commentTimes;
            
            
        } else {
            console.log("瀏覽器不支援LocalStorage");
        }
    });
    
    if(typeof(Storage) !== "undefined") {
        if(localStorage["listItem_recordTime"]!=null){
            var lastTime = localStorage["listItem_recordTime"];
            $("div.tminfo>time").after("  <span style='color:red'>上次紀錄時間:"+lastTime+"</span>");
        }
        var now = new Date();
        var nowString = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
        localStorage["listItem_recordTime"] = nowString;
    }
}