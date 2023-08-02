const socket = io.connect('https://hii-qf50.onrender.com/');
var username;
var chats=document.querySelector(".chats");
var roomMessage=document.querySelector(".title");
var users_list=document.querySelector(".users-list");
var users_count=document.querySelector(".users-count");
var msg_send=document.querySelector("#user-send");
var user_msg=document.querySelector("#user-msg");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const user_name = urlParams.get('user_name');
const room_name = urlParams.get('room_name');
let div=document.createElement("div");
div.classList.add("room-name");
div.innerHTML="Room Name : "+room_name;
roomMessage.appendChild(div);
socket.emit("new-user-joined",{username:user_name,roomname:room_name});
socket.on("user-connected",(socket_name)=>
{
    userJoinLeft(socket_name,"joined");
});
function userJoinLeft(name,status){
  let div=document.createElement("div");
  div.classList.add("user-join");
  let content=`<p><b> ${name} </b> ${status}  the  chat</p>`;
  div.innerHTML=content;
  chats.appendChild(div);
  chats.scrollTop=chats.scrollHeight;

}
socket.on("user-disconnected",(user)=>{
    userJoinLeft(user,"left");
});  
socket.on("user-list",(users)=>{
users_list.innerHTML="";
users_arr=Object.values(users);

for(i=0;i<users_arr.length;i++)
{
 let p=document.createElement("p");
 //alert(Object.values(users_arr[i]));

 p.innerHTML=Object.values(users_arr[i]);
 users_list.appendChild(p);
}
users_count.innerHTML=users_arr.length;
});

msg_send.addEventListener("click",()=>{
    let data={
        roomname:room_name,
        user:user_name,
        msg:user_msg.value
    };
    if(user_msg.value!='')
    {
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        user_msg.value='';
    }
});
function appendMessage(data,status)
{
    let div=document.createElement("div");
    div.classList.add("message",status);
    let content=`<h5>${data.user}</h5>
    <p>${data.msg}</p>`;
    div.innerHTML=content;
    chats.appendChild(div); 
    chats.scrollTop=chats.scrollHeight;
}
socket.on("message",(data)=>{
    appendMessage(data,"incoming");
});
