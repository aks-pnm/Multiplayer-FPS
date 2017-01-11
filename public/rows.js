function getdata(){
         $.ajax({
      url: '/topscore',
      type: 'GET',
      dataType: "json",
      contentType: 'application/json',
      data: {},
      success: function(response) {
         var row = new Array();
          var index = 0;
 for (i in response){
     row[++index] ='<tr><th>';
     row[++index] = response[i].personname;
     row[++index] = '</th><th>';
     row[++index] = response[i].score;
     row[++index] = '</th></tr>';
 }
  $('#top1').html(row.join('')); 
//$("#top tbody").append(row);

      }
    });
}

function removeRow(){
   //   $('#bottom tbody').remove();
}

function putCurrentData(response){
//    $('#bottom tbody').remove();
  //  $('#bottom tbody > tr').remove();

var row = new Array();
var index = -1;
var htmlCode= '';
 for (i in response.player){
     var player = response.players[i];
  htmlCode=htmlCode+'<tr><th>'+ player.id+'</th><th>'+player.score+'</th></tr>';
     /*row[++index] ='<tr><td>';
     row[++index] = response.id;
     row[++index] = '</td><td>';
     row[++index] = response.score;
     row[++index] = '</td></tr>';*/
 }
 $('#bottom').innerHTML= htmlCode; 
    console.log(htmlCode);
 //$('#bottom1').html(row.join('')); 
}

