function createCode(){    
	var code = "";
	var codeLength = 6;   
	//var selectChar = new Array(0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'); 
	var selectChar = new Array('0','1','2','3','4','5','6','7','8','9');
	for(var i=0;i<codeLength;i++){
		var charIndex = Math.floor(Math.random()*10);   
		code +=selectChar[charIndex];   
	}
  	return code;
}