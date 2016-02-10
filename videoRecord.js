// ==UserScript==
// @name         B站-影片撥放紀錄
// @namespace    http://firemaples.blogspot.tw/
// @version      0.3
// @description  顯示數值的增加數
// @author       Firemaples
// @match        http://www.bilibili.com/video/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var loopTime = 1000;
var addTextColor = "red";

$(function(){
    console.log('loaded');
    setTimeout(loadScores, loopTime);
});

function loadScores(){
    var videoId = location.href.split("/")[location.href.split("/").length-2];
    console.log("影片id:" + videoId);
    
    var divPlayTimes = $("div.v-title-line>span#dianji");
    var playTimes = divPlayTimes.text();
    if(!$.isNumeric(playTimes)){
        setTimeout(loadScores, loopTime);
        return;
    }
    if(playTimes.match("万$")){
        playTimes = playTimes.replace(/万/g,"") * 10000;
    }
    console.log("撥放數:" + playTimes);
    
    var divCommentTimes = $("div.v-title-line>span#dm_count");
    var commentTimes = divCommentTimes.text();
    console.log("彈幕數:" + commentTimes);
    
    var divCoinTimes = $("div.v-title-line>span#v_ctimes");
    var divCoinTimes1 = $("div.arc-toolbar>div.coin span.t-right-bottom");
    var coinTimes = divCoinTimes.text();
    console.log("硬幣數:" + coinTimes);
    
    var divSavingTimes = $("div.v-title-line>span#stow_count");
    var divSavingTimes1 = $("div.arc-toolbar>div.fav span.t-right-bottom");
    var savingTimes = divSavingTimes.text();
    console.log("收藏數:" + savingTimes);
    
    var divShareTimes = $("div.arc-toolbar>div.share span.t-right-bottom");
    var shareTimes = divShareTimes.text();
    console.log("分享數:" + shareTimes);
    
    if(typeof(Storage) !== "undefined") {
        var tagPlayTimes = "videoPage_" + videoId + "_pt";
        var tagCommentTimes = "videoPage_" + videoId + "_ct";
        var tagCoinTimes = "videoPage_" + videoId + "_coint";
        var tagSavingTimes = "videoPage_" + videoId + "_st";
        var tagShareTimes = "videoPage_" + videoId + "_sharet";
        var tagRecordTime = "videoPage_" + videoId + "_rt";

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
        
        if(localStorage[tagCoinTimes] != null){
            var lastCT = localStorage[tagCoinTimes];
            var add = coinTimes - lastCT;

            console.log("前次硬幣數:" + lastCT);
            if(add > 0){
                divCoinTimes.css("color",addTextColor).css("font-weight","bolder");
                divCoinTimes1.css("color",addTextColor).css("font-weight","bolder");
            }
            divCoinTimes.text(coinTimes + " (+" + add + ")");
            divCoinTimes1.text(coinTimes + " (+" + add + ")");
        }
        
        if(localStorage[tagSavingTimes] != null){
            var lastCT = localStorage[tagSavingTimes];
            var add = savingTimes - lastCT;

            console.log("前次收藏數:" + lastCT);
            if(add > 0){
                divSavingTimes.css("color",addTextColor).css("font-weight","bolder");
                divSavingTimes1.css("color",addTextColor).css("font-weight","bolder");
            }
            divSavingTimes.text(savingTimes + " (+" + add + ")");
            divSavingTimes1.text(savingTimes + " (+" + add + ")");
        }
        
        if(localStorage[tagShareTimes] != null){
            var lastCT = localStorage[tagShareTimes];
            var add = shareTimes - lastCT;

            console.log("前次分享數:" + lastCT);
            if(add > 0){
                divShareTimes.css("color",addTextColor).css("font-weight","bolder");
            }
            divShareTimes.text(shareTimes + " (+" + add + ")");
        }

        //儲存紀錄
        localStorage[tagPlayTimes] = playTimes;
        localStorage[tagCommentTimes] = commentTimes;
        localStorage[tagCoinTimes] = coinTimes;
        localStorage[tagSavingTimes] = savingTimes;
        localStorage[tagShareTimes] = shareTimes;
        
        if(localStorage[tagRecordTime]!=null){
            var lastTime = localStorage[tagRecordTime];
            $("div.tminfo>time").after("  <span style='color:red'>上次紀錄時間:"+lastTime+"</span>");
        }
        var now = new Date();
        var nowString = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
        localStorage[tagRecordTime] = nowString;


    } else {
        console.log("瀏覽器不支援LocalStorage");
    }
}