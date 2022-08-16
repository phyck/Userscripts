// ==UserScript==
// @name			Binance Futures Tweak
// @namespace		https://github.com/phyck/Userscripts/
// @description:0	Few cool tweaks for binance.com futures platform
// @description:1	Auto hides header & creates "ctrl+K" hotkey to toggle, hides the annoying AF "Close All Positions" button
// @description:3	Creates hotkeys to quickly filter pair on open orders & trade/order history pages.
// @description:4	"A" for All / "B" for BTC / "E" for ETH / "L" for LTC / "X" for XMR / "D" for DOT
// @description:5	"Shift+B" for BTCBUSD / "Shift+E" for ETHBUSD / "Shift+L" for LTCBUSD
// @version			1.0
// @author			phyck
// @license			GNU AGPLv3
// @icon			https://bin.bnbstatic.com/static/images/common/favicon.ico
// @homepage		https://github.com/phyck/Userscripts/
// @updateURL		https://github.com/phyck/Userscripts/raw/main/BinanceFuturesTweak.user.js
// @downloadURL		https://github.com/phyck/Userscripts/raw/main/BinanceFuturesTweak.user.js
// @match			https://www.binance.com/en/my/orders/futures/*
// @match			https://www.binance.com/en/futures/*
// @match			https://www.binance.com/en/delivery/*
// @grant			none
// @require			https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

'use strict';
var headerHidden = 0;
//$(window).ready(function($) {
//window.addEventListener('load', function() {
$(window).on("load", function() {
	console.log("$(window) loaded!");
	main();
});

function main() {
	//$("#__APP").on("load", function() {
	$("#__APP").ready(function() {
		console.log('$("#__APP").ready!');
		toggleHeader();
		if (window.location.href.indexOf("binance.com/en/futures/" > -1) || window.location.href.indexOf("binance.com/en/delivery/") > -1) {
			//setMaxHeight();
			// Hide STUPID "Close All Positions" button!!!
			$("button[class=' css-u3kl37']").toggle();
		}

		window.addEventListener("keydown", function(ev, ele) {
			// Toggle header with hotkey Ctrl+K
			if (ev.ctrlKey && ev.code === 'KeyK') {
				console.log("Toggling header!");
				toggleHeader();
			}
		});

		if (window.location.href.indexOf("history") > -1) {
			$(".rc-picker-input-active").ready(function() {
			//$(".list-content").on("load", function() {
				console.log(".rc-picker-input-active ready!")
				// Set date range to last 2 days on history pages
				const today = new Date();
				today.setDate(today.getDate());
				const yesterday = new Date();
				yesterday.setDate(yesterday.getDate() - 1);
				var startDate = formatDate(yesterday).toString();
				console.log("startDate: " + startDate); // 2022-08-12
				var endDate = formatDate(today).toString();
				console.log("EndDate: " + endDate);
				if($(".rc-picker-input-active").length==0) {
					window.alert('$(".rc-picker-input-active").length==0');
				}
				else {
					$(".rc-picker-input-active").click();
					$('td[title="'+startDate+'"]').click();
					$('td[title="'+endDate+'"]').click();
					$(".search-button").click();
				}
			});
		}

		// activate futures orders page hotkeys to filter major crypto symbols
		if (window.location.href.indexOf("/my/orders/futures/") > -1) {//=='https://www.binance.com/en/my/orders/futures/openorder')
			window.addEventListener("keydown", function(ev, ele) {
				switch (ev.key.toUpperCase()) {
						// Clear filter
					case "A":
						console.log("All");
						$("#ALL .css-1pysja1").click();
						break;
						// BTCUSDT
					case "B":
						console.log("BTCUSDT");
						$("#BTCUSDT").click();
						break;
						// ETHUSDT
					case "E":
						console.log("ETHUSDT");
						$("#ETHUSDT").click();
						break;
						// XMRUSDT
					case "X":
						console.log("XMRUSDT");
						$("#XMRUSDT").click();
						break;
						// LTCUSDT
					case "L":
						console.log("LTCUSDT");
						$("#LTCUSDT").click();
						break;
						// DOTUSDT
					case "D":
						console.log("DOTUSDT");
						$("#DOTUSDT").click();
						break;
				};
				// BTCBUSD
				if (ev.shiftKey && ev.code === 'KeyB') {
					console.log("BTCBUSD");
					console.log(ev.key.toUpperCase());
					$("#BTCBUSD").click();
				}
				// ETHBUSD
				if (ev.shiftKey && ev.code === 'KeyE') {
					console.log("ETHBUSD");
					console.log(ev.key.toUpperCase());
					$("#ETHBUSD").click();
				}
				// LTCBUSD
				if (ev.shiftKey && ev.code === 'KeyL') {
					console.log("LTCBUSD");
					console.log(ev.key.toUpperCase());
					$("#LTCBUSD").click();
				}
				// Click search button to filter on futures order & trade history pages.
				if (window.location.href.indexOf("history") > -1) {
					$(".search-button").click();
				}
			});
		}
		console.log("Done!");
	});
}

// Toggle navbar visibility
function toggleHeader() {
	// div[name='header'] element on futures trading page
	if ($("div[name='header']").length) {
		if(headerHidden) {
			$("div[name='header']").toggle();
			$(".css-1efks0a").css("height","100%");
			headerHidden = 0;
		} else {
			$("div[name='header']").toggle();
			$(".css-1efks0a").height($(".react-grid-layout").height()+$(".css-ugq4b8").height());
			headerHidden = 1;
		}
	} else if ($("header").length) {
		// Simple header element on orders & history pages
		$("header").toggle();
	} else {
		console.log("No header found! toggleHeader() failed!");
	}
}

function padTo2Digits(num) {
	return num.toString().padStart(2, '0');
}

function formatDate(date) {
	return [
		date.getFullYear(),
		padTo2Digits(date.getMonth() + 1),
		padTo2Digits(date.getDate()),
	].join('-');
}