/****************************************************************/
/*                                                              */
/* Licensed Materials - Property of IBM                         */
/* 5725-F96 IBM MessageSight                                    */
/* (C) Copyright IBM Corp. 2012, 2013 All Rights Reserved.      */
/*                                                              */
/* US Government Users Restricted Rights - Use, duplication or  */
/* disclosure restricted by GSA ADP Schedule Contract with      */
/* IBM Corp.                                                    */
/*                                                              */
/****************************************************************/

//
// requires mqttws31.js
//

var client = null;
var server = "quickstart.messaging.internetofthings.ibmcloud.com";
var port = 443;

// We build a deviceId that represents a randomly generated MAC address
var deviceId = Math.floor(Math.random() * 16).toString(16) +
          Math.floor(Math.random() * 16).toString(16) +
          Math.floor(Math.random() * 16).toString(16) +
          Math.floor(Math.random() * 16).toString(16) +
          Math.floor(Math.random() * 16).toString(16) +
          Math.floor(Math.random() * 16).toString(16) +
          Math.floor(Math.random() * 16).toString(16) +
          Math.floor(Math.random() * 16).toString(16) +
          Math.floor(Math.random() * 16).toString(16) +
          Math.floor(Math.random() * 16).toString(16) +
          Math.floor(Math.random() * 16).toString(16) +
          Math.floor(Math.random() * 16).toString(16);

var url = "http://quickstart.internetofthings.ibmcloud.com/?deviceId="+deviceId;

var clientId = "d:quickstart:iotqs-sensor:"+deviceId;
var interval = 2000;

//clear the interval when connection is lost or failed
var timer = null;

function connectionLost() {
    console.log("connection lost! - reconnecting");
    clearInterval(timer);
    client.connect({
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure,
        useSSL: true
    });
}

function onMessage(topic, payload) {
    var topic = msg.destinationName;
    var payload = msg.payloadString;
    var qos = msg._getQos();
    var retained = msg._getRetained();

    var qosStr = ((qos > 0) ? "[qos " + qos + "]" : "");
    var retainedStr = ((retained) ? "[retained]" : "");
    appendLog(">> [" + topic + "]" + qosStr + retainedStr + " " + payload);
}

// -----------------------------------------------------
// Next function comes from http://detectmobilebrowsers.com 
// -----------------------------------------------------
window.mobilecheck = function() {
var check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
return check; }

function onConnectSuccess() {
    console.log("connected as " + clientId);
    var x=window.mobilecheck();
    console.log("window.mobilecheck " + x);

    if ( window.mobilecheck() ) {
             url=""; // Do not display link to monitoring page on mobile devices.
         // the mobile device is the sensor. 
         // Use a computer or other device to monitor the device.
    }
    
    if ( url != "" && url != null){
        $("#deviceId").html("<a target='_blank' href='"+url+"'>"+deviceId+"</a>");
    } else {
        $("#deviceId").html(deviceId);
    }

    timer = setInterval(publish, interval);
    publish();
}

function onConnectFailure() {
    $("#deviceId").html("not connected");
    clearInterval(timer);
    console.log("failed! - retry connection w/ clientId"+clientId);
    client.connect({
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure,
        useSSL: true
    });
}

function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
    client.disconnect();
};

function init() {

    try {
        client = new Messaging.Client(server, port, clientId);
    } catch (error) {
        console.log("Error:"+error);
    }

    client.onMessageArrived = onMessage;
    client.onConnectionLost = connectionLost;
    client.connect({
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure,
        useSSL: true
    });

    $("#interval").html(interval);

    $("#myCarousel").swiperight(function() {  
        $("#myCarousel").carousel('prev');  
    });  
    $("#myCarousel").swipeleft(function() {  
        $("#myCarousel").carousel('next');  
    });
    $('#myCarousel').carousel('pause');

    for (var i in sensors) {
        $("#"+i+"Down").click((function(type) {
            return function() { 
                if (sensors[type] > lowerLimits[type]) {
                    sensors[type] -= 1; 
                    //updateSensors(type, -1);
                    publish(type, -1);
                }
            }
        })(i));
        $("#"+i+"Up").click((function(type) {
            return function() { 
                if (sensors[type] < upperLimits[type]) {
                    sensors[type] += 1; 
                    //updateSensors(type, 1);
                    publish(type, 1);
                }
            }
        })(i));
    }

    updateSensors();
}

var sensors = {
    rotarySpeed: 15 + Math.random() * 4,
    gearVibration: 75 + Math.random() * 5,
    bearingTemperature: 23 + Math.random() * 4,
    motorTemperature:23 + Math.random() * 4,
    pulleyFriction: 31 + Math.random() * 4

};

var lowerLimits = {
    rotarySpeed: 0,
    gearVibration: 0,
    bearingTemperature: -100,
    motorTemperature:-100,
    pulleyFriction: 0
};

var upperLimits = {
    rotarySpeed: 100,
    gearVibration: 100,
    bearingTemperature: 100,
    motorTemperature: 100,
    pulleyFriction: 100
};

function updateSensors(type,value) {
    //console.log(type);
    //console.log(value);
    for (var i in sensors) {
        if (i == "bearingTemperature") {
            
            sensors[i] = Math.floor(parseFloat(sensors[i]));
            $("#"+i+"Reading").html(sensors[i] + "&deg;C");
        }
        if (i == "motorTemperature") {
            sensors[i] = Math.floor(parseFloat(sensors[i]));
            $("#" + i + "Reading").html(sensors[i] + "&deg;C");
        }
        if (i == "rotarySpeed") {
            sensors[i] = Math.floor(parseFloat(sensors[i]));
            $("#"+i+"Reading").html(sensors[i] + "m/s");
        }
        if (i == "gearVibration") {
            sensors[i] = Math.floor(parseFloat(sensors[i]));
            $("#"+i+"Reading").html(sensors[i] + "Hz");
        }
        if (i == "pulleyFriction") {
            sensors[i] = Math.floor(parseFloat(sensors[i]));
            $("#" + i + "Reading").html(sensors[i] + "(f)");
        }
    }

    var payload = {
        d: {
            name: deviceId,
            rotarySpeed: sensors.rotarySpeed,
            gearVibration: sensors.gearVibration,
            bearingTemperature: sensors.bearingTemperature,
            motorTemperature: sensors.motorTemperature,
            pulleyFriction: sensors.pulleyFriction,
           }
    };
    if (type == undefined) {
        return payload;
    }
    else if (type == "bearingTemperature") {

        payload.d["bearingCooaent"] = value;

        return payload;
        //console.log(payload);
    }
    else if (type == "motorTemperature") {
        payload.d["motorCoolant"] = value;

        return payload;
        //console.log(payload);
    }
    else if (type == "rotarySpeed") {
        payload.d["BeltLubricant"] = value;

        return payload;
        console.log(payload);
    }
    else if (type == "gearVibration") {
        payload.d["gearPositionCorrection"] = value;
        return payload;
       // console.log(payload);
    }
    else if (type == "pulleyFriction") {
        payload.d["pulleyLubricant"] = value;
        return payload;
        //console.log(payload);
    }


   

}

function publish(type, value) {
    var payload = updateSensors(type, value);
    //console.log(payload);
    var topic = "iot-2/evt/iotsensor/fmt/json";

    //var payload = {
    //    d: {
    //        name: deviceId,            
    //        rotarySpeed: sensors.rotarySpeed,
    //        gearVibration: sensors.gearVibration,
    //        bearingTemperature: sensors.bearingTemperature,
    //        motorTemperature: sensors.motorTemperature,
    //        pulleyFriction: sensors.pulleyFriction
    //    }
    //};
    var message = new Messaging.Message(JSON.stringify(payload));
    message.destinationName = topic;
    //console.log("publish | " + message.destinationName + " | " + message.payloadString);
    client.send(message);
    
}


 
