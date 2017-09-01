console.log("我是eventPage(#^.^#)                      1");

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "hello")
            sendResponse({farewell: "goodbye"});
        else
            sendResponse({}); // snub them.
    });

console.log("我是eventPage(#^.^#)                      2");
