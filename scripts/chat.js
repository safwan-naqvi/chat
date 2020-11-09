function startChat(id) {
    document.getElementById('chatPanel').removeAttribute('style');
    document.getElementById('divStart').setAttribute('style', 'display:none');
    hideChatList();
}
//////////////////////

function showChatList() {
    document.getElementById('side-1').classList.remove('d-none', 'd-md-block');
    document.getElementById('side-2').classList.add('d-none');
}

function hideChatList() {
    document.getElementById('side-1').classList.add('d-none', 'd-md-block');
    document.getElementById('side-2').classList.remove('d-none');
}

function OnKeyDown() {
    document.addEventListener('keydown', function(key) {
        if (key.which === 13) {
            SendMessage();
        }
    });
}

function SendMessage() {
    var message = `<div class="row justify-content-end">
                            
    <div class="col-6 col-sm-7 col-md-7">
        <p class="sent float-right">${document.getElementById('txtMessage').value}
            <span class="time float-right">1:28 PM</span>
        </p>
    </div>
    <div class="col-2 col-sm-1 col-md-1">
        <img src="img/pp.png" class="chat-pic">
    </div>
</div>`;

    document.getElementById('messages').innerHTML += message;
    document.getElementById('txtMessage').value = '';
    document.getElementById('txtMessage').focus();

    document.getElementById('messages').scrollTo(0, document.getElementById('messages').clientHeight)

}


////////////////////////////////////////////////////
function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}

function signOut() {
    firebase.auth().signOut();
}

function onFirebaseStateChanged() {
    firebase.auth().onAuthStateChanged(onStateChanged);
}

function onStateChanged(user) {
    if (user) {
        var userProfile = { email: '', name: '', photoURL: '' };
        userProfile.email = firebase.auth().currentUser.email;
        userProfile.name = firebase.auth().currentUser.displayName;
        userProfile.photoURL = firebase.auth().currentUser.photoURL;

        var db = firebase.database.ref('users');
        var flag = false;
        db.on('value', function(users) {
            users.forEach(function(data) {
                var user = data.val();
                if (user.email === userProfile.email)
                    flag = true;
            });

            if (flag === false) {
                firebase.database().ref('users').push(userProfile, callback);
            } else {
                alert(firebase.auth().currentUser.email + '\n' + firebase.auth().currentUser.displayName + 'inside db function true else');
                document.getElementById('imgProfile').src = firebase.auth().currentUser.photoURL;
                document.getElementById('imgProfile').title = firebase.auth().currentUser.displayName;

                document.getElementById('lnkSignIn').style = 'display:none';
                document.getElementById('lnkSignOut').style = ' ';
            }
        });
    } else {
        //alert(firebase.auth().currentUser.email + '\n' + firebase.auth().currentUser.displayName);
        document.getElementById('imgProfile').src = 'img/pp.png';
        document.getElementById('imgProfile').title = '';

        document.getElementById('lnkSignIn').style = ' ';
        document.getElementById('lnkSignOut').style = 'display:none';
    }
}

function callback(error) {
    if (error) {
        alert(error);
    } else {
        document.getElementById('imgProfile').src = firebase.auth().currentUser.photoURL;
        document.getElementById('imgProfile').title = firebase.auth().currentUser.displayName;

        document.getElementById('lnkSignIn').style = 'display:none';
        document.getElementById('lnkSignOut').style = ' ';
    }
}


/////////////
//call auth state changed
//

onFirebaseStateChanged();