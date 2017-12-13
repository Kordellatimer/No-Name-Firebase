 var messageBoardDB = new Firebase("https://safeplace-ca64a.firebaseio.com/")

$(document).ready(function() {

  $('#message-form').submit(function(k) {
    // by default a form submit reloads the DOM which will subsequently reload all our JS
    // to avoid this we preventDefault()
    k.preventDefault()

    // grab user message input
    var message = $('#thought').val()

    // clear message input (for UX purposes)
    $('#thought').val('')

    // create a section for messages data in your db
    var messagesReference = messageBoardDB.child("messages");

    // use the set method to save data to the messages
    messagesReference.push({
      message: message,
      votes: 0,
    });

  });
  messageClass.getThoughts();
});

var messageClass = (function () {
function getThoughts() {
  // retrieve messages data when .on() initially executes
  // and when its data updates
  messageBoardDB.child('messages').on('value', function (results) {
    var $messageBoard = $('.message-board')
    var $topMessage = $('.top-message')
    var messages = []
    var vote =[]



    var allMessages = results.val();
    // iterate through results coming from database call; messages
    for (var msg in allMessages) {
      // get method is supposed to represent HTTP GET method
      var message = allMessages[msg].message
      var votes = allMessages[msg].votes

      // create message element
      var $messageListElement = $('<li></li>')
      var $topListElement = $('<li></li>')


      // create up vote element
      var $upVoteElement = $('<i class="fa fa-thumbs-up pull-right"></i>')
      $upVoteElement.on('click', function (e) {
        var id = $(e.target.parentNode).data('id')
        updateMessage(id, ++votes)
      })

      // add id as data attribute so we can refer to later for updating
      $messageListElement.attr('data-id', msg)
      $topListElement.attr('data-id', msg)

      // add message to li
      $messageListElement.html(message)
      $topListElement.html(message)

      // add voting elements
      $messageListElement.append($upVoteElement)

      // show votes
      $messageListElement.append('<div class="pull-right">' + votes + '</div>')

      // push element to array of messages
      messages.push($messageListElement)

      vote.push($topListElement)


      // remove lis to avoid dupes
      $messageBoard.empty()
      $topMessage.empty()

      for (var i in messages) {
        $messageBoard.append(messages[i])

      }
      console.log(vote)
        $topMessage.append(vote[0])
    }
  })

}

  function updateMessage(id, votes) {
    // find message whose objectId is equal to the id we're searching with
    var messageReference = new Firebase('https://safeplace-ca64a.firebaseio.com/messages/' + id)

    // update votes property
    messageReference.update({
      votes: votes
    })

  }

  function deleteMessage(id) {
    // find message whose objectId is equal to the id we're searching with
    var messageReference = new Firebase('https://safeplace-ca64a.firebaseio.com/messages/' + id)

    messageReference.remove();

    $("li").attr("data-id",id).remove();

      messageClass.getMessages();
  }

  return {
    getThoughts: getThoughts
  }

})();
