var container = $('#container');
var score = [0, 0];
var movieData = {};

var questions = [
    {
        q: "Year",
        format: "What year was this made?"
    },
    {
        q: "Director",
        format: "Who directed this film?"
    },
    {
        q: "Runtime",
        format: "How long is this movie?"
    },
    {
        q: "Rated",
        format: "What is this movie rated?"
    },

    {
        q: "Genre",
        format: "What genre is the movie?"
    },
    {
        q: "Actors",
        format: "Name another actor in the movie?"
    }


];

/* get user input */
$('#submit').click( function() {
    searchMovie( $('#movie')[0].value );
});

/* get movie data */
var searchMovie = function(movieTitle) {
    var url = "http://www.omdbapi.com/?t=" + movieTitle;
    $.getJSON(url, function(data) {
        console.log(data);
        if (data.Error) {
            container.append( $("<p>").text("Movie not found, please try again :)") );
        } else {
            populatePageData(data.Title, data.Plot);

            movieData = data;
            setupQuestion();
        }
    });
};

var setupQuestion = function() {
    var randomNumber = Math.floor( Math.random() * questions.length );
    askQuestion(randomNumber, movieData[questions[randomNumber].q]);
};

/* populate basic page data */
var populatePageData = function(title, plot) {
    $('#enter').hide();
    container.append( $("<h2>").text(title) )
        .append( $('<p>').text(plot) );
};

/* ask user questions */
var askQuestion = function(num, value) {
    var q = $('<div>').attr('id', 'question')
        .append( $("<p>")
                .text( questions[num].format ) )
        .append( $("<input>")
                .attr({type: "text", id: "answer"})
                )
        .append( $("<input>")
                .attr({type:"submit", id: "submitQ"})
                .on('click', function() {
                    evaluateQuestion( value.toLowerCase().includes($('#answer')[0].value.toLowerCase())  , value );
                })
               );
    container.append(q);
    questions.splice(num, 1);

};

/* evaluate user answers */
var evaluateQuestion = function(correct, value) {
    $('#question').remove();
    score[1]++;
    var a = $("<div>").attr("id", "answer");
    if (correct) {
        score[0]++;
        a.append( $('<p>')
                         .html("Great Job! You got it.<br> Score: " + score[0] + "/" + score[1])
                         );
    } else {
        a.append( $('<p>')
                         .html("Nope! Sorry.  The correct answer was " + value + ".<br> Score: " + score[0] + "/" + score[1])
                         );
    }
    if (questions.length > 0) {
        a.append( $("<input>")
                .attr({type:"submit", value:"Click to ask another question."})
                .on('click', function() {
                    $(a).remove();
                    setupQuestion();
                })
               );
    }
    if(score[1] == 6)document.getElementById("poster").src=movieData.Poster;
    container.append(a);
};
