console.log("我是get_pin_info");

// chrome.extension.sendRequest({greeting: "hello"}, function (response) {
//     console.log(response.farewell);
// });

// var div = document.getElementsByClassName("order-detail-buyer-info-content eye-protector-processed");
// if (div != null) {
//     var peopleInfo = div.getElementsByClassName("o-d-b-i-c-people");
//     if (peopleInfo != null) {
//
//         console.log(div.valueOf());
//     }
// }

var tempInfo = document.getElementsByClassName("o-d-b-i-c-people");
if (tempInfo != null) {
    console.log(tempInfo.valueOf());
}
var peopelInfo = tempInfo.item(1);

if (peopelInfo != null) {
    console.log(peopelInfo.valueOf());
}
