// ==UserScript==
// @name	        Binance Futures Tweak
// @namespace		https://github.com/phyck/Userscripts/
// @description:0	Few tweaks for binance.com futures platform
// @description:1	Auto hides header & creates "ctrl+K" hotkey to toggle, hides the annoying AF "Close All Positions button"
// @description:3	Creates hotkeys to quickly filter pair on open orders & trade/order history pages.
// @description:4	"A" for All / "B" for BTC / "E" for ETH / "L" for LTC / "X" for XMR / "D" for DOT
// @description:5	"Shift+B" for BTCBUSD / "Shift+E" for ETHBUSD / "Shift+L" for LTCBUSD
// @version			1.6
// @license			GNU AGPLv3
// @icon			https://bin.bnbstatic.com/static/images/common/favicon.ico
// @homepage		https://github.com/phyck/Userscripts/
// @updateURL		https://github.com/phyck/Userscripts/BinanceFuturesTweak.user.js
// @downloadURL		https://github.com/phyck/Userscripts/BinanceFuturesTweak.user.js
// @match			https://www.binance.com/en/my/orders/futures/*
// @match			https://www.binance.com/en/futures/*
// @match			https://www.binance.com/en/delivery/*
// @grant			none
// @require			https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

main();

function main() {
	window.addEventListener('load', function() {
		console.log("DOMContentLoaded!");
		if (window.location.href.indexOf("binance.com/en/futures/" > -1) || window.location.href.indexOf("binance.com/en/delivery/") > -1) {
			setMaxHeight();
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
		setTimeout(() => {
			toggleHeader();
		}, 1000);
	// activate futures orders page hotkeys to filter major crypto symbols
	if (window.location.href.indexOf("/my/orders/futures/") > -1) {//=='https://www.binance.com/en/my/orders/futures/openorder')
		window.addEventListener("keydown", function(ev, ele) {
			switch (ev.key.toUpperCase()) {
				// Clear filter
				case "A":
					console.log("All");
					document.querySelector("#ALL").click();
					break;
				// BTCUSDT
				case "B":
					console.log("BTCUSDT");
					document.querySelector("#BTCUSDT").click();
					break;
				// ETHUSDT
				case "E":
					console.log("ETHUSDT");
					document.querySelector("#ETHUSDT").click();
					break;
				// XMRUSDT
				case "X":
					console.log("XMRUSDT");
					document.querySelector("#XMRUSDT").click();
					break;
				// LTCUSDT
				case "L":
					console.log("LTCUSDT");
					document.querySelector("#LTCUSDT").click();
					break;
				// DOTUSDT
				case "D":
					console.log("DOTUSDT");
					document.querySelector("#DOTUSDT").click();
					break;
			};
			// BTCBUSD
			if (ev.shiftKey && ev.code === 'KeyB') {
				console.log("BTCBUSD");
				console.log(ev.key.toUpperCase());
				document.querySelector("#BTCBUSD").click();
			}
			// ETHBUSD
			if (ev.shiftKey && ev.code === 'KeyE') {
				console.log("ETHBUSD");
				console.log(ev.key.toUpperCase());
				document.querySelector("#ETHBUSD").click();
			}
			// LTCBUSD
			if (ev.shiftKey && ev.code === 'KeyL') {
				console.log("LTCBUSD");
				console.log(ev.key.toUpperCase());
				document.querySelector("#LTCBUSD").click();
			}
			// Click search button to filter on futures order & trade history pages.
			if (window.location.href.indexOf("history") > -1) {
				document.querySelector(".search-button").click();
			}
		})};
	console.log("Done!");
	});
}

function setMaxHeight() {
    console.log("doc.height: " + $(document).height());
    console.log("win.height: " + $(window).height());
    $(".css-1efks0a").css("maxHeight", ( $(window).height() * 1.23 | 0 ) + "px");
}

// Toggle navbar visibility
function toggleHeader() {
	// div[name='header'] element on futures trading page
	if ($("div[name='header']").length) {
		$("div[name='header']").toggle();
	} else if ($("header").length) {
		// Simple header element on orders & history pages
		$("header").toggle();
	} else {
		console.log("No header found! toggleHeader() failed!");
	}
}