var issuesData;
var last24HrData;
var last7daysData;
var olderThen7Data;


/*
* This function needs to be tested as it was not waiting for the response
*/
function ajax(){
	  $.ajax({
      url: 'https://api.github.com/repos/Shippable/support/issues',
	  async : false,
      data: {
         format: 'json'
      },
      error: function() {
         $('#info').html('<p>An error has occurred</p>');
      },
      dataType: 'jsonp',
      success: function(data, textStatus, jqXHR) {
		 debugger;
		return data;
      },
      type: 'GET'
   });
};


function ajax(url,reqType){
	var returnData;
	$.ajax( {
		url : url,
		type : reqType,
		async : false,
		headers : {
		"Content-Type" : "application/json"
		},
		dataType : 'json',
		success : function(data, textStatus, jqXHR) {
		// console.log(data);
			returnData=data;
		},
		error : function(data, textStatus, jqXHR) {
			debugger;
		xmldoc = jqXHR.responseXML;
		$('#networkErrorModal').modal('show');
		},

	});
	return returnData;
}

function bindIssueTable(data) {
	//.getElementsByTagName('tbody')
    var table = document.getElementById("issueTableBody");
	/* remove all data from the table before inserting*/
	$("#issueTableBody").find("tr").remove();
	for(var i=0;i<data.length;i++){
		var row = table.insertRow(i);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var cell4 = row.insertCell(3);
		cell1.innerHTML = i+1;
		cell2.innerHTML = data[i].title;
		if(data[i].assignee!=null){
		//	cell3.innerHTML = data[i].assignee.login;
			cell3.innerHTML = '<img src='+data[i].assignee.avatar_url +' height="30" width="30" class="img-circle">';
		}
		cell4.innerHTML = data[i].state;
	}
};


function getAllOpenIssues(url){
	var issueUrl = url+"/issues?state=open"
	issuesData = ajax(issueUrl,"GET");

	last24HrData=[];
	var lastDate = new Date();
	lastDate.setDate(lastDate.getDate() - 1);
	
	last7daysData=[];
	var days7BackDate = new Date();
	days7BackDate.setDate(days7BackDate.getDate()-7);
	
	olderThen7Data=[];
	
	for(var i=0;i<issuesData.length;i++){
		if(issuesData[i].created_at>lastDate.toISOString()){
			last24HrData.push(issuesData[i]);
		}
		
		else if(issuesData[i].created_at<lastDate.toISOString() && issuesData[i].created_at>days7BackDate.toISOString()){
			last7daysData.push(issuesData[i]);
		}
		else{
			olderThen7Data.push(issuesData[i]);
		}
	}
	document.getElementById("allIssueCount").innerHTML=issuesData.length;
	document.getElementById("last24HrsCount").innerHTML=last24HrData.length;
	document.getElementById("last7daysCount").innerHTML= last7daysData.length;
	document.getElementById("before7daysCount").innerHTML=olderThen7Data.length;
	bindIssueTable(issuesData);
}

function getlast24HrOpenIssues(url){
	var currentDate = new Date();
	var last24HrDate = new Date();
	/*Subtract 24 Hrs from current date*/
	last24HrDate.setHours(currentDate.getHours() - 24);
	var issueUrl = url+"/issues?state=open&since="+last24HrDate.toISOString();
	
	//state=closed&since=2016-02-03T03:27:13.537Z
	var data = ajax(issueUrl,"GET");
	bindIssueTable(data);
}


$(function(){
	
	$('#allIssues').on('click', function (e) {

	var publicRepositoryUrl = "https://api.github.com/repos/"+document.getElementById("repositoryUrl").value;
	getAllOpenIssues(publicRepositoryUrl);
	bindIssueTable(issuesData);
});

$('#repositoryUrl').keydown(function(e){
    if (e.keyCode == 13) {
		var publicRepositoryUrl = "https://api.github.com/repos/"+document.getElementById("repositoryUrl").value;
		getAllOpenIssues(publicRepositoryUrl);
		if(document.getElementById("repositoryUrl").value=='' || document.getElementById("repositoryUrl").value==null){
			$('#networkErrorModal').modal('show');
		}
		else{
			bindIssueTable(issuesData);
		}
    }
});


	$('#pullIssueBtn').on('click', function (e) {

	var publicRepositoryUrl = "https://api.github.com/repos/"+document.getElementById("repositoryUrl").value;
	getAllOpenIssues(publicRepositoryUrl);
	if(document.getElementById("repositoryUrl").value=='' || document.getElementById("repositoryUrl").value==null){
			$('#networkErrorModal').modal('show');
	}
		else{
			bindIssueTable(issuesData);
		}
});



$('#last24Hrs').on('click', function (e) {

	bindIssueTable(last24HrData);

});
$('#last7days').on('click', function (e) {
	bindIssueTable(last7daysData);
});
$('#before7').on('click', function (e) {

	bindIssueTable(olderThen7Data);
});


});
