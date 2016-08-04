angular
.module('app', ["pubnub.angular.service"])
.controller('ChatCtrl', function($scope, Pubnub) {
    $scope.channel = 'messages-channel';
    // Generating a random uuid between 1 and 100 using an utility function from the lodash library.
    $scope.uuid = _.random(100000).toString();
    $scope.messages = [];
    $scope.messageContent = '';

    Pubnub.init({
        publish_key: 'pub-c-8d86de8f-7a94-4a65-b0cc-b586e417e53f',
        subscribe_key: 'sub-c-0367ee82-59c9-11e6-9746-0619f8945a4f',
        ssl: true,
        uuid: $scope.uuid
    });

    // Send the messages over PubNub Network
    $scope.sendMessage = function() {
        // Don't send an empty message
        if (!$scope.messageContent ||
            $scope.messageContent === '') {
            return;
        }
        Pubnub.publish({
            channel: $scope.channel,
            message: {
                content: $scope.messageContent,
                sender_uuid: $scope.uuid,
                date: new Date()
            },
            callback: function(m) {
                console.log(m);
            }
        });
        // Reset the messageContent input
        $scope.messageContent = '';
    }

    // Subscribe to messages channel
    Pubnub.subscribe({
        channel: $scope.channel,
        triggerEvents: ['callback']
    });

    // Listening to the callbacks
    $scope.$on(Pubnub.getMessageEventNameFor($scope.channel), function (ngEvent, m) {
        $scope.$apply(function () {
            $scope.messages.push(m)
        });
    });

    // A function to display a nice uniq robot avatar
    $scope.avatarUrl = function(uuid){
        console.log('uuid', uuid);
        return 'http://robohash.org/'+uuid+'?set=set2&bgset=bg2&size=70x70';
    };
});
