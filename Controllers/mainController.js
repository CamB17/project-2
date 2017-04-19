
function landingPage(request, response){
	
	//.render() renders views folder files (√)
	response.render('index');
}




module.exports = {
	landingPage: landingPage
};