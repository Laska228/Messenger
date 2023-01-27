function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

const swup = new Swup();

const contextMenu = document.querySelector(".wrapper"),
shareMenu = contextMenu.querySelector(".share-menu");
copy = contextMenu.querySelector(".uil uil-copy");
window.addEventListener("contextmenu", e => {
  var tooltip = document.getElementById("myTooltip");
var selectionText = getSelectionText();
    if(selectionText.length > 10) selectionText = selectionText.slice(0,10);
    console.log(selectionText.length);
    tooltip.innerHTML = "Copied: " + selectionText + "...";
    e.preventDefault();
    let x = e.offsetX, y = e.offsetY,
    winWidth = window.innerWidth,
    winHeight = window.innerHeight,
    cmWidth = contextMenu.offsetWidth,
    cmHeight = contextMenu.offsetHeight;
    if(x > (winWidth - cmWidth - shareMenu.offsetWidth)) {
        shareMenu.style.left = "-200px";
    } else {
        shareMenu.style.left = "";
        shareMenu.style.right = "-200px";
    }
    x = x > winWidth - cmWidth ? winWidth - cmWidth - 5 : x;
    y = y > winHeight - cmHeight ? winHeight - cmHeight - 5 : y;

    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.visibility = "visible";
});

document.addEventListener("click", () => contextMenu.style.visibility = "hidden");


function getSelectionText() {
  var text = "";
  var activeEl = document.activeElement;
  var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
  if (
    (activeElTagName == "textarea") || (activeElTagName == "input" &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
    (typeof activeEl.selectionStart == "number")
  ) {
    text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
  } else if (window.getSelection) {
    text = window.getSelection().toString();
  }
  document.execCommand("copy");

  return text;
}

var saveText = function() {
  var selectionText = getSelectionText();
  document.getElementById("sel").innerHTML = selectionText;
  //пост отправка
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true); //url - адрес, на который надо отправить записку.
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(JSON.stringify({
    note: selectionText
  }));
}


function txtdecode(Incode, passCode)
{
	var b52 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var maxPC = 0;
	for(var i=0; i<passCode.length; i++) maxPC += passCode.charCodeAt(i);
	maxPCmod = maxPC;
	ifPC = 0;
	//Разбиваем строку на массив, который будет состоять из каждого закодированного символа
	var Incode = Incode.match(/\d+\w/g);
	var rexcode = "";
	var numPC = 0;
	for(var i=0; i<Incode.length; i++)
	{
		if(numPC == passCode.length) numPC = 0;
		if(maxPCmod < 1) maxPCmod = maxPC+ifPC;
		ifPC += maxPCmod % passCode.charCodeAt(numPC);
		var iscode = maxPCmod % passCode.charCodeAt(numPC);
		//В отличии от фунции кодирования, тут дейтсвие происходит в обратную сторону
		var nCode = (parseInt(Incode[i])*52)+parseInt(b52.indexOf(Incode[i].substr(-1)));
		maxPCmod -= passCode.charCodeAt(numPC);
		numPC++;
		//И в результате соответственно уже не сложение, а вычитание
		rexcode += String.fromCharCode(nCode-iscode);
	}
	//Уже можно вернуть return rexcode.
	//Но для корректного отображения в браузере, я преобразую некоторые символы во мнемоники, а урлы преобразую в ссылки.
//	return rexcode.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/ /g, " ").replace(/\r\n|\r|\n/g,"<br />").replace(/(https?\:\/\/|www\.)([а-яА-Я\d\w#!:.?+=&%@!\-\/]+)/gi, function(url)
//	{
//		return '<a target="_blank" href="'+ (( url.match('^https?:\/\/') )?url:'http://' + url) +'">'+ url +'</a>';
//	});
	return rexcode;
}


function txtencode(Incode, passCode)
{
	var b52 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var maxPC = ifPC = 0;
	for(var i=0; i<passCode.length; i++) maxPC += passCode.charCodeAt(i);
	maxPCmod = maxPC;
	var rexcode = "";
	var numPC = 0;
	for(var i=0; i<Incode.length; i++)
	{
		if(numPC == passCode.length) numPC = 0;
		if(maxPCmod < 1) maxPCmod = maxPC+ifPC;
		ifPC += maxPCmod % passCode.charCodeAt(numPC);
		var iscode = maxPCmod % passCode.charCodeAt(numPC);
		var nCode = (Incode.charCodeAt(i)+iscode);
		maxPCmod -= passCode.charCodeAt(numPC);
		numPC++;
		rexcode += parseInt(nCode / 52) + b52.charAt(parseInt(nCode % 52));
	}
	return rexcode;
}


window.onload = function() {


        let url = `ws://${window.location.host}/ws/socket-server/`

        const chatSocket = new WebSocket(url)

        chatSocket.onmessage = function(e){
            let data = JSON.parse(e.data)
            console.log('Data:', data)

            if(data.type === 'chat'){
                sender();
            }
        }

//        let form = document.getElementById('form')
//        form.addEventListener('submit', (e)=> {
//            e.preventDefault()
//            let message = e.target.message.value
//            chatSocket.send(JSON.stringify({
//                'message':message
//            }))
//            form.reset()
//        })

//    $(document).on('submit', '#post-form', function(e) {
//        console.log("HEY");
//        e.preventDefault()
//        let message = e.target.message.value
//        chatSocket.send(JSON.stringify({
//            'message':message
//        }))
//        document.getElementById('message').value = '';
//    	document.getElementById('file').value = '';
//    });





//	setInterval(function() {
//		$.ajax({
//			type: 'GET',
//			url: "/getMessages/" + room,
//			success: function(response) {
//                $(".container_home").empty();
//				for(item in response.all_users){
//				    var users_list = document.createElement("div");
//				    var user_contact = document.createElement("input");
//				    var avatar = document.createElement("img");
//				    avatar.src = "//" + window.location.host + "/media/" + response.all_users[item].image;
//				    console.log(avatar.src);
//				    avatar.setAttribute('class', 'avatar_profile');
//				    user_contact.setAttribute('class', 'users');
//				    user_contact.setAttribute('type', 'submit');
//				    user_contact.value = response.all_users[item].username;
//				    users_list.appendChild(avatar);
//				    users_list.appendChild(user_contact);
//	                document.querySelector(".container_home").append(users_list);
//                }
//			},
//		});
//	}, 2000);



	document.querySelector('#name').addEventListener('click', () => {
		document.querySelector('.attachments').classList.add('active');
		document.querySelector('.send_div').classList.add('active');
		document.querySelector('.close-menu').classList.add('close-menu-active');
		document.querySelector('.send_div').classList.add('active');
		document.querySelector('.room_body').classList.add('active');
		document.querySelector('#name').classList.add('active');
	})
	document.querySelector('.close-menu').addEventListener('click', () => {
		document.querySelector('.attachments').classList.remove('active');
		document.querySelector('.send_div').classList.remove('active');
		document.querySelector('.close-menu').classList.remove('close-menu-active')
		document.querySelector('.send_div').classList.remove('active');
		document.querySelector('.room_body').classList.remove('active');
		document.querySelector('#name').classList.remove('active');
	})

	let contextmenu_check = 0;
	<!--        (function() {-->
	<!--          "use strict";-->
	<!--          document.addEventListener( "contextmenu", function(e) {-->
	<!--            if(contextmenu_check){-->
	<!--                contextmenu_check = 0;-->
	<!--                document.oncontextmenu = function () { // Используйте объект "document" вместо "window" для совместимости с IE8.-->
	<!--                   return false;-->
	<!--                };-->
	<!--            }-->
	<!--            else{-->
	<!--                contextmenu_check = 1;-->
	<!--            console.log(contextmenu_check);-->
	<!--                document.oncontextmenu = function () { // Используйте объект "document" вместо "window" для совместимости с IE8.-->
	<!--                   return true;-->
	<!--                };-->
	<!--            }-->
	<!--          });-->
	<!--        })();-->
	<!--        document.getElementByClass("message_menu").addEventListener('contextmenu', function (e) {-->
	<!--            console.log("DA");-->
	<!--        });-->
	function message_menu() {
		console.log("DA");
	}
	<!--                const openMenu = document.getElementById('SEARCH');-->
	<!--                openMenu.addEventListener('click', (e) => {-->
	<!--                  e.preventDefault();-->
	<!--                  openMenu.nextElementSibling.classList.toggle('open-content&#45;&#45;show')-->
	<!--                });-->
	<!--                const base = document.getElementById('search_list');-->
	<!--                noviy = ['3', '5', '7'];-->
	<!--                openMenu.addEventListener('change', e => {-->
	<!--                    for(var rf = 0; rf < 3; ++rf){-->
	<!--                        let prav = document.querySelector('div');-->
	<!--                        let div = document.createElement('div');-->
	<!--                        div.innerHTML = 'asd';-->
	<!--                        if(noviy[rf] == '5')-->
	<!--                            base.replace(noviy[rf],"asd");-->
	<!--                        else{-->
	<!--                            base.append(noviy[rf]+" ");-->
	<!--                        }-->
	<!--                    }-->
	<!--                });-->
	check_mes_update = 0;
	check_mes_update_file = 0;

    room = document.getElementById("room").value;
	$(document).ready(sender);

	function sender() {
		$.ajax({
			type: 'GET',
			url: "/getMessages/" + room,
			success: function(response) {
				console.log(response);
				$("#display").empty();
				$("#attachment_videos").empty();
				$("#attachment_photos").empty();
				$("#attachment_files").empty();
				$("#attachment_music").empty();
				$("#attachment_links").empty();
				var this_date = new Date();
				block_date = "";
				months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				//var scrll = document.querySelector(".room_body").scrollHeight;
				check_mes_update = response.messages.length;
				check_mes_update_file = response.files.length;
				mes_amount = check_mes_update;
				if (mes_amount < 50) mes_amount = 50;
				for (var key = mes_amount - 50; key < check_mes_update; ++key) {
					if (key == 0 || (key > 0 && response.messages[key].date.slice(0, 10) != response.messages[key - 1].date.slice(0, 10))) {
						month = response.messages[key].date.slice(5, 7) - 1;
						block_date = "<div id='block_date'>" + (months[month] + ' ' + (response.messages[key].date.slice(8, 10) - 0)) + "</div>";
						$("#display").append(block_date);
					}
					if (this_date.getMonth() + 1 != response.messages[key].date.slice(5, 7) && (key == 0 || (key > 0 && response.messages[key].date.slice(5, 7) != response.messages[key - 1].date.slice(5, 7)))) {
						new_month_check = 1;
						block_month = "<div id='block_date'>" + months[month] + "</div>";
					} else new_month_check = 0;
					var temp = "";
					let temp2 = document.createElement('div');
					var len = response.messages[key].value.length;
					var check_transfer = 0;
					var mes = '';
					mes_value = response.messages[key].value;
					if (mes_value != "") {
						for (var i = 0; i < len; ++i) {
							++check_transfer;
							mes += mes_value[i];
							if (check_transfer > 100 && mes_value[i] == " ") {
								mes += "\n";
								check_transfer = 0;
							}
							if (check_transfer > 110) {
								mes += "\n";
								check_transfer = 0;
							}
							if (mes_value[i] == "\n") {
								mes += "\n";
								check_transfer = 0;
							}
						}
					}
                    if(mes != "") mes = txtdecode(mes,"1234");
					mes = urlify(mes);
//					mes = "<xmp>" + mes + "</xmp>";
					counter_img = 0;
					var user_file = "";
					for (var files_key in response.files) {
						if (response.files[files_key].mes_id == response.messages[key].id) {
							++counter_img;
							if (response.files[files_key].file != "False") {
								let attach_file = document.createElement('span');
								user_file = "http://127.0.0.1:8000" + response.files[files_key].file;
								var file_type = response.files[files_key].file.split('.').pop();
								if (file_type == "jpg" || file_type == "png" || file_type == "jpeg" || file_type == "jpg") {
									var img = document.createElement("img");
									img.src = user_file;
									img.setAttribute('class', 'mes_img');
									var attachment_photo = img;
									attachment_photo = document.createElement("img");
									attachment_photo.src = user_file;
									attachment_photo.setAttribute('class', 'mes_img attachment_photo');
									user_file_pres = "<img class='mes_img' src=\"" + user_file + "\">";
									attach_file.innerHTML = "<img class='attachment_photo mes_img' src=\"" + user_file + "\">";
									$("#attachment_photos").prepend(attachment_photo);

									if (new_month_check) $("#attachment_photos").prepend(block_month);
									<!--                                                    temp2.innerHTML = "<img class='mes_img' src=\"" + user_file + "\">";-->
								} else if (file_type == "mp3" || file_type == "ogg") {
									user_file_pres = "<audio controls><source type='audio/mpeg' src=\"" + user_file + "\"></audio>";
									attach_file.innerHTML = "<audio loading='eager' controls><source type='audio/mpeg' src=\"" + user_file + "\"></audio>";
									attachment_music.prepend(attach_file);
									if (new_month_check) $("#attachment_music").prepend(block_month);
								} else if (file_type == "mp4" || file_type == "mov") {
									user_file_pres = "<video loading='lazy' class='mes_img' controls><source type='video/mp4' src=\"" + user_file + "\"></video>";
									attach_file.innerHTML = "<video loading='lazy' class='attachment_photo' controls><source type='video/mp4' src=\"" + user_file + "\"></video>";
									attachment_videos.prepend(attach_file);
									if (new_month_check) $("#attachment_videos").prepend(block_month);
								} else {
									user_file_pres = "<a id='user_link' target='_blank' href=\"" + user_file + "\">Link to the file</a>";
									attach_file.innerHTML = "<a target='_blank' href=\"" + user_file + "\">Link to the file</a>";
									attachment_files.prepend(attach_file);
									if (new_month_check) $("#attachment_files").prepend(block_month);
								}
								temp2.innerHTML += "<span>" + user_file_pres + "</span>";
							}
						}
					}
					<!--                                    if(user_file != "")-->
					<!--                                        temp += "<span>"+user_file_pres+"</span>";-->
					//temp += '<p><img class="mes_avatar" src="{% static 'Images/default_avatar.jpg' %}" alt="avatar">';
                    if(response.messages[key].viewed == true)
                        viewed = "<img id='viewed_check' src=\"//" + window.location.host + "/static/Images/dialogs_received@3x.png\">";
                    else
                        viewed = "<img id='viewed_check' src=\"//" + window.location.host + "/static/Images/dialogs_sent@3x.png\">";

					if (response.messages[key].value != "") {
						temp2.innerHTML += "<p><div oncontextmenu='message_menu' contextmenu='mymenu' class='message'>" + mes + "<span id='viewed_span'>" + viewed + "</span></div>";
						temp += "<p><div oncontextmenu='message_menu' contextmenu='mymenu' class='message'>" + mes + "<span id='viewed_span'>" + viewed + "</span></div>";
					}
					temp += "<p><span class='time-left'>" + response.messages[key].date.slice(11, 16) + "</span>"
					temp2.innerHTML += "<p><span class='time-left'>" + response.messages[key].date.slice(11, 16) + "</span>";
					if ((response.messages[key].user) != "{{users}}") {
						temp2.setAttribute('class', 'message_menu darker room_div floating_out container');
						temp = "1" + "<div class='message_menu darker room_div floating_out container'>" + temp + "<div>";
					} else
						temp = "2" + "<div oncontextmenu='message_menu' contextmenu='mymenu' class='message_menu darker room_div other_color floating_out container'>" + temp + "<div>";
					var files_num = -1;
					for (var files_key in response.files) {
						if (response.files[files_key].mes_id == response.messages[key].id) {
						    var file_type = response.files[files_key].file.split('.').pop();
                            if (user_file != "" && (file_type == "jpg" || file_type == "png" || file_type == "jpeg" || file_type == "jpg" || file_type == "mp4" || file_type == "mov")) {
                                ++files_num;
                                var modal = document.getElementById('myModal');
                                img_comment = document.getElementById('img_comment');
                                var modalImg = document.getElementById("img01");
                                var captionText = document.getElementById("caption");
                                temp2.getElementsByClassName('mes_img')[files_num].onclick = attachment_photo.onclick = function() {
                                    modal.style.display = "block";
                                    modalImg.src = this.src;
                                    if (temp2.getElementsByTagName('xmp')[0] == undefined)
                                        captionText.innerHTML = "";
                                    else
                                        captionText.innerHTML = temp2.getElementsByTagName('xmp')[0].textContent;
                                }
                                modal.onclick = function() {
                                    modal.style.display = "none";
                                }
                            }
                        }
                    }
					$("#display").append(temp2);
					var div = document.getElementsByClassName('room_body');
					div[0].scrollTo(0, document.querySelector(".room_body").scrollHeight);
				}
			},
			error: function(response) {
//				alert('An error occured')
			}
		});
	}

	function urlify(text) {
		var link = /(https?:\/\/[^\s]+)/g;
		var user = /@[^\s]+/g
		var email = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
		var urlRegex = new RegExp(link.source + "|" + user.source + "|" + email.source);
		return text.replace(urlRegex, function(url) {
        <!--                        attach_file.innerHTML = '<a id="link_in_mes" target="_blank" href="' + url + '">' + url + '</a>';-->
        <!--                        attachment_links.prepend(attach_file);-->
			if (email.test(url)) return '</xmp><a id="link_in_mes" target="_blank" href="mailto:' + url + '">' + url + '</a><xmp>';
			if (link.test(url)) return '</xmp><a id="link_in_mes" target="_blank" href="' + url + '">' + url + '</a><xmp>';
		})
	}
	var all_audio = document.getElementsByTagName("audio");
	console.log(all_audio);
	var index = 0;
	for (i = 0; i < all_audio.length; i++) {
		console.log(all_audio);
		all_audio[i].id = i;
		all_audio[i].onended = function() {
			index = parseInt(this.id) + 1;
			if (index == all_audio.length) index = 0;
			all_audio[index].play();
		}
	}
	$(function() {
		$("audio").on("play", function() {
			$("audio").not(this).each(function(index, audio) {
				audio.pause();
			});
		});
	});
	<!--const contextMenu = document.querySelector(".wrapper"),-->
	<!--shareMenu = contextMenu.querySelector(".share-menu");-->
	<!--window.addEventListener("contextmenu", e => {-->
	<!--    e.preventDefault();-->
	<!--    let x = e.offsetX, y = e.offsetY,-->
	<!--    winWidth = window.innerWidth,-->
	<!--    winHeight = window.innerHeight,-->
	<!--    cmWidth = contextMenu.offsetWidth,-->
	<!--    cmHeight = contextMenu.offsetHeight;-->
	<!--    if(x > (winWidth - cmWidth - shareMenu.offsetWidth)) {-->
	<!--        shareMenu.style.left = "-200px";-->
	<!--    } else {-->
	<!--        shareMenu.style.left = "";-->
	<!--        shareMenu.style.right = "-200px";-->
	<!--    }-->
	<!--    x = x > winWidth - cmWidth ? winWidth - cmWidth - 5 : x;-->
	<!--    y = y > winHeight - cmHeight ? winHeight - cmHeight - 5 : y;-->
	<!--    contextMenu.style.left = `${x}px`;-->
	<!--    contextMenu.style.top = `${y}px`;-->
	<!--    contextMenu.style.visibility = "visible";-->
	<!--});-->
	<!--document.addEventListener("click", () => contextMenu.style.visibility = "hidden");-->
	console.log("document.getElementsByClassName)")
	const tx = document.getElementsByClassName("textarea");
	for (let i = 0; i < tx.length; i++) {
		tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
		tx[i].addEventListener("input", OnInput, false);
	}
	function OnInput() {
		this.style.height = 0;
		this.style.height = (this.scrollHeight) + "px";
	}
	$("textarea").keypress(function(e) {
		if (e.which == 13 && !e.shiftKey) {
			e.preventDefault();
			this.style.height = 40 + "px";
			$(this).closest("form").submit();
		}
	});
	$(document).on('submit', '#post-form', function(e) {
		e.preventDefault();
        let message = txtencode(e.target.message.value, "1234")
        chatSocket.send(JSON.stringify({
            'message': message
        }))
        const formData = new FormData(this);
        formData.append("message", message);
		$.ajax({
			type: 'POST',
			url: '/send',
			cache: false,
			contentType: false,
			processData: false,
			data: formData,
			success: function(data) {
//				alert(data);
			},
			error: function(data) {
//				alert("Завершилось с ошибкой");
//				console.log("MISTAKE", data);
			}
		});

		document.getElementById('message').value = '';
		document.getElementById('file').value = '';
	});

}
