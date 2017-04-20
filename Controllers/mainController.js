function landingPage(request, response){
	
	//.render() renders views folder files (√)
	response.render('index');
}

function homePage(request, response){
	//console.log("username: " + request.user.local.username);
	response.render('index');
}





module.exports = {
	landingPage: landingPage,
	homePage:homePage
};