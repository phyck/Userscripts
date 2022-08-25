// ==UserScript==
// @name			Binance Futures Tweak
// @namespace		https://github.com/phyck/Userscripts/
// @description:0	Few cool tweaks for binance.com futures platform
// @description:1	Auto hides header & creates "ctrl+K" hotkey to toggle, hides the annoying AF "Close All Positions" button
// @description:3	Creates hotkeys to quickly filter pair on open orders & trade/order history pages.
// @description:4	"A" for All / "B" for BTC / "E" for ETH / "L" for LTC / "X" for XMR / "D" for DOT
// @description:5	"Shift+B" for BTCBUSD / "Shift+E" for ETHBUSD / "Shift+L" for LTCBUSD
// @description:6	Auto refresh on open orders & trade/order history pages. Toggle with "Shift+R"
// @version			1.2
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
var autoRefreshDelay = 60;
var dateRange = 2;
var headerHidden = 0;
var autoRefresh = 0;
var autoRefreshCountdownDiv;
var autoRefreshTimer;

window.addEventListener("load", function () {
	console.log("BFT:\tWindow loaded!");
	setTimeout(main, 2500);
});

function main() {
	$("#__APP").ready(function() {
		console.log("BFT:\t#__APP ready!");
		toggleHeader();
		if (window.location.href.indexOf("binance.com/en/futures/" > -1) || window.location.href.indexOf("binance.com/en/delivery/") > -1) {
			// Hide STUPID "Close All Positions" button!!!
			$("button[class=' css-u3kl37']").toggle();
		}

		window.addEventListener("keydown", function(ev, ele) {
			// Toggle header with hotkey Ctrl+K
			if (ev.ctrlKey && ev.code === 'KeyK') {
				toggleHeader();
			}
		});

		if (window.location.href.indexOf("history") > -1) {
			setDateRange();
		}

		// activate futures orders page hotkeys to filter major crypto symbols
		if (window.location.href.indexOf("/my/orders/futures/") > -1) {//=='https://www.binance.com/en/my/orders/futures/openorder')
			injectCounterDiv();
			//startAutoRefresh();
			window.addEventListener("keydown", function(ev, ele) {
				switch (ev.key.toUpperCase()) {
					// Clear filter
					case "A":
						console.log("BFT:\tAll");
						$("#ALL .css-1pysja1").click();
						isHistory();
						break;
					// BTCUSDT
					case "B":
						console.log("BFT:\tBTCUSDT");
						$("#BTCUSDT").click();
						isHistory();
						break;
					// ETHUSDT
					case "E":
						console.log("BFT:\tETHUSDT");
						$("#ETHUSDT").click();
						isHistory();
						break;
					// XMRUSDT
					case "X":
						console.log("BFT:\tXMRUSDT");
						$("#XMRUSDT").click();
						isHistory();
						break;
					// LTCUSDT
					case "L":
						console.log("BFT:\tLTCUSDT");
						$("#LTCUSDT").click();
						isHistory();
						break;
					// DOTUSDT
					case "D":
						console.log("BFT:\tDOTUSDT");
						$("#DOTUSDT").click();
						isHistory();
						break;
				};
				// BTCBUSD
				if (ev.shiftKey && ev.code === 'KeyB') {
					console.log("BFT:\tBTCBUSD");
					console.log(ev.key.toUpperCase());
					$("#BTCBUSD").click();
					isHistory();
				}
				// ETHBUSD
				if (ev.shiftKey && ev.code === 'KeyE') {
					console.log("BFT:\tETHBUSD");
					console.log(ev.key.toUpperCase());
					$("#ETHBUSD").click();
					isHistory();
				}
				// LTCBUSD
				if (ev.shiftKey && ev.code === 'KeyL') {
					console.log("BFT:\tLTCBUSD");
					console.log(ev.key.toUpperCase());
					$("#LTCBUSD").click();
					isHistory();
				}
				// Toggle auto refresh with "Shift+R"
				if (ev.shiftKey && ev.code === 'KeyR') {
					toggleAutoRefresh();
				}
			});
		}
		console.log("BFT:\tDone!");
	});
}

// Toggle navbar visibility
function toggleHeader() {
	console.log("BFT:\tToggling header!");
	if ($("div[name='header']").length) {	// div[name='header'] element on futures trading page
		if(headerHidden) {
			$("div[name='header']").toggle();
			$(".css-1efks0a").css("height","100%");
			headerHidden = 0;
		} else {
			$("div[name='header']").toggle();
			$(".css-1efks0a").height($(".react-grid-layout").height()+$(".css-ugq4b8").height());
			headerHidden = 1;
		}
	} else if ($("header").length) {	// Simple header element on orders & history pages
		$("header").toggle();
	} else {
		console.log("\nBFT:\tNo header found! toggleHeader() failed!\n")
		console.log("Retrying toggleHeader!");
		setTimeout(toggleHeader, 1000);
	}
}

// Set date range on history page
function setDateRange() {
	$(".rc-picker-input-active").ready(function() {
		console.log("BFT:\t.rc-picker-input-active ready!");
		// Set date range to prev x days specified by dateRange.
		var startDate = new Date();
		startDate.setDate(startDate.getDate() - dateRange + 1);
		startDate = formatDate(startDate).toString();
		//console.log("BFT:\tstartDate: " + startDate); // 2022-08-12
		var endDate = new Date();
		endDate.setDate(endDate.getDate());
		endDate = formatDate(endDate).toString();
		//console.log("BFT:\tendDate: " + endDate);
		if ($(".rc-picker-input-active").length) {
			$(".rc-picker-input-active").click();
			$('td[title="' + startDate + '"]').click();
			$('td[title="' + endDate + '"]').click();
			isHistory();
			console.log("BFT:\tDate range set!");
		} else {
			console.log("\nBFT:\t.rc-picker-input-active not found!");
			console.log("BFT:\tFailed to set date range!\n");
			console.log("Retrying setDateRange()!");
			setTimeout(setDateRange, 2000);
		}
	});
}

// Click search button to filter on futures order & trade history pages.
function isHistory() {
	if (window.location.href.indexOf("history") > -1) {
		$(".search-button").click();
	}
}

// Create a div to display auto refresh countdown.
function injectCounterDiv() {
	$(".title-wrap").ready(function() {
		console.log("BFT:\t.title-wrap ready!");
		$(".title-wrap").clone().prependTo(".page-top");
		$(".title-wrap").eq(1).find(".css-10nf7hq").remove();
		$(".title-wrap").eq(1).find(".css-1escwmk").remove();
		$(".css-18kqmhp").eq(1).addClass("counter");
		autoRefreshCountdownDiv = $(".counter");
		if (autoRefreshCountdownDiv.length) { // Simple header element on orders & history pages
			console.log("BFT:\tautoRefreshCountdownDiv created!");
			autoRefreshCountdownDiv.html("Auto refresh off!");
			toggleAutoRefresh();
		} else {
			console.log("\nBFT:\tFailed to create autoRefreshCountdownDiv!\n");
			console.log("Retrying injectCounterDiv()!\n");
			setTimeout(injectCounterDiv, 1500);
		}
	});
}

// Toggle automatic refresh
function toggleAutoRefresh() {
	console.log("BFT:\tToggle auto refresh");
	if(autoRefresh) {
		stopAutoRefresh();
	} else {
		startAutoRefresh();
	}
}

function stopAutoRefresh() {
	autoRefresh = 0;
	clearInterval(autoRefreshTimer);
	autoRefreshCountdownDiv.html("Auto refresh off!");
}

function startAutoRefresh() {
	autoRefresh = 1;
	autoRefreshDelay = 60;
	autoRefreshCountdownDiv.html("Auto refresh on!");
	autoRefreshTimer = setInterval(autoRefreshCountdown, 1000);
}

function refresh() {
	console.log("BFT:\tAuto refreshing!");
	if (window.location.href.indexOf("history") > -1) {			// Click search-button on trade/order history pages
		$(".search-button").click();
	}
	else {
		$(".css-stc8a0").find(".bnb-active-option").click();	// Click currently selected symbol on on order pages
	}
	clearInterval(autoRefreshTimer);
	console.clear();
	startAutoRefresh();
}

function autoRefreshCountdown() {
	if (autoRefreshDelay == 0) {
		refresh();
	} else {
		var autoRefreshMsg = "Auto refresh in " + autoRefreshDelay + " seconds!";
		autoRefreshCountdownDiv.html(autoRefreshMsg);
		if(autoRefreshDelay % 10 == 0) {
			console.log("BFT:\t"+autoRefreshMsg);
		}
		autoRefreshDelay--;
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