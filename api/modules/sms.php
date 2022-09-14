<?php
//Send an SMS using Gatewayapi.com
$url = "https://gatewayapi.com/rest/mtsms";
$api_token = "imF6KC2FQd-qC9N-VZtQMuRgHCKW5MqADJkObG5y-sW0iXputDx-Wqg5E-DQHL_G";

//Set SMS recipients and content
$recipients = [5353498546];
$json = [
    'sender' => 'miTaller - Skynet',
    'message' => 'Su ticket se ha registrado correctamente, si esta viendo este sms es porque permitio que le enviaran informacion acerca del estado.',
    'recipients' => [],
];
foreach ($recipients as $msisdn) {
    $json['recipients'][] = ['msisdn' => $msisdn];
}

//print_r($json);
//Make and execute the http request
//Using the built-in 'curl' library
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
curl_setopt($ch, CURLOPT_USERPWD, $api_token . ":");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($json));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
echo $result;
curl_close($ch);
print($result);
$json = json_decode($result);
print_r($json->ids);
