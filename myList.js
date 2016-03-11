// ==UserScript==
// @name         B站-個人列表紀錄
// @namespace    http://firemaples.blogspot.tw/
// @version      0.2
// @description  try to take over the world!
// @author       顯示個人列表紀錄與上次差異數
// @match        http://member.bilibili.com/*
// @grant        none
// Chrome plugin: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
// Update Url: https://rawgit.com/firemaples/ExtendJQForBS/master/myList.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var loopTime = 1000;
var addTextColor = "red";

$('div.banner-logo').parent().append('<button type="button" id="bt_loadScores" style="font-size: 30px;margin-left: 10px;margin-top: 10px;" onclick="loadScores()">取得紀錄</button>')

$('body').append('<script>'+loadScores.toString()+'</script>');

if(location.href.match("^http://member.bilibili.com/#video_manage")){
    //當在列表頁重整
    console.log("當在列表頁重整");
    //waitingForListLoading();
}

function waitingForListLoading(){
    if($('.main-content-list-infor').length > 0){
        console.log("loaded!");
        setTimeout(loadScores, loopTime);
    }else{
        console.log("loading...");
        setTimeout(waitingForListLoading, loopTime);
    }
}

function loadScores(){
    var loaded = false;
    
    if($('.main-content-list-infor').length == 0) return;
    $('.main-content-list-infor').each(function(){
        if(loaded == true) return;
        
        var item = $(this);
        var subItem = item.find('div.tminfo');
        
        var videoId = item.find('div.title>a').attr('href').substring(32,39);
        console.log("影片id:" + videoId);
        
        var divPlayTimes = subItem.find('i#dianji');
        var playTimes = divPlayTimes.text().trim();
        if(playTimes.match("万$")){
            playTimes = playTimes.replace(/万/g,"") * 10000;
        }
        console.log("撥放數:" + playTimes);
        if(!$.isNumeric(playTimes)){ 
            console.log("撥放數內容非數字，已經載入?");
            loaded = true;
            return;
        }
        
        var divCommentTimes = subItem.find('i#dm_count');
        var commentTimes = divCommentTimes.text().trim();
        console.log("彈幕數:" + commentTimes);
        
        var divReplyTimes = subItem.find('i#review_count');
        var replyTimes = divReplyTimes.text();
        console.log("評論數:" + replyTimes);

        var divSavingTimes = subItem.find('i#stow_count');
        var savingTimes = divSavingTimes.text();
        console.log("收藏數:" + savingTimes);
        
        var divCoinTimes = subItem.find('i#pt>span.v_ctimes');
        var coinTimes = divCoinTimes.text();
        console.log("硬幣數:" + coinTimes);
        
        if(typeof(Storage) !== "undefined") {
            var tagPlayTimes = "myListItem_" + videoId + "_pt";
            var tagCommentTimes = "myListItem_" + videoId + "_ct";
            var tagReplyTimes = "myListItem_" + videoId + "_replyt";
            var tagSavingTimes = "myListItem_" + videoId + "_st";
            var tagCoinTimes = "myListItem_" + videoId + "_coint";

            
            //讀取紀錄
            if(localStorage[tagPlayTimes] != null){
                var lastPT = localStorage[tagPlayTimes];
                var add = playTimes - lastPT;
                
                console.log("前次撥放數:" + lastPT);
                if(add > 0){
                    divPlayTimes.css("color","red").css("font-weight","bolder");
                }
                divPlayTimes.text(playTimes + " (+" + add + ")");
            }
            
            if(localStorage[tagCommentTimes] != null){
                var lastCT = localStorage[tagCommentTimes];
                var add = commentTimes - lastCT;
                
                console.log("前次彈幕數:" + lastCT);
                if(add > 0){
                    divCommentTimes.css("color","red").css("font-weight","bolder");
                }
                divCommentTimes.text(commentTimes + " (+" + add + ")");
            }
            
            if(localStorage[tagReplyTimes] != null){
                var lastCT = localStorage[tagReplyTimes];
                var add = replyTimes - lastCT;
                
                console.log("前次評論數:" + lastCT);
                if(add > 0){
                    divReplyTimes.css("color","red").css("font-weight","bolder");
                }
                divReplyTimes.text(replyTimes + " (+" + add + ")");
            }
            
            if(localStorage[tagSavingTimes] != null){
                var lastCT = localStorage[tagSavingTimes];
                var add = savingTimes - lastCT;
                
                console.log("前次收藏數:" + lastCT);
                if(add > 0){
                    divSavingTimes.css("color","red").css("font-weight","bolder");
                }
                divSavingTimes.text(savingTimes + " (+" + add + ")");
            }
            
            if(localStorage[tagCoinTimes] != null){
                var lastCT = localStorage[tagCoinTimes];
                var add = coinTimes - lastCT;
                
                console.log("前次硬幣數:" + lastCT);
                if(add > 0){
                    divCoinTimes.css("color","red").css("font-weight","bolder");
                }
                divCoinTimes.text(coinTimes + " (+" + add + ")");
            }
            
            //儲存紀錄
            localStorage[tagPlayTimes] = playTimes;
            localStorage[tagCommentTimes] = commentTimes;
            localStorage[tagReplyTimes] = replyTimes;
            localStorage[tagSavingTimes] = savingTimes;
            localStorage[tagCoinTimes] = coinTimes;
            
        } else {
            console.log("瀏覽器不支援LocalStorage");
        }
    });
    
    if(loaded == true) return;
    
    console.log('讀取上次紀錄時間')
    var tagRecordTime = "myListItem_rt";
            
    if(localStorage[tagRecordTime]!=null){
        var lastTime = localStorage[tagRecordTime];
        $('button#bt_loadScores').text("上次紀錄時間:"+lastTime);
    }
    var now = new Date();
    var nowString = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
    localStorage[tagRecordTime] = nowString;
}