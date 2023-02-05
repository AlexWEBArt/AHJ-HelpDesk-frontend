// TODO: write code here

import background from '../img/cell.jpg';
import Storage from './Storage';
import Popup from './Popup';
import RenderingNote from './RenderingNote';

const storage = new Storage();
// storage.clear()
const dataBase = storage.load();

document.querySelector('body').style.backgroundImage = `url(${background})`;

const popup = new Popup(storage);
const renderingNote = new RenderingNote(storage, popup);

const containerPopup = document.querySelector('.app_container');
const btnAdd = document.querySelector('.btn_add');

if (dataBase !== null) {
  for (const key in dataBase) {
    if (!Object.prototype.hasOwnProperty.call(dataBase, 'key')) {
      renderingNote.action(dataBase[key]);
    }
  }
}

btnAdd.addEventListener('click', (e) => {
  e.preventDefault();

  popup.openPopup(containerPopup);
});

// const subscribeWidget = document.querySelector('.subscribe');
// const subscribeForm = subscribeWidget.querySelector('.subscribe-form');
// const nameInput = subscribeWidget.querySelector('.name');
// const phoneInput = subscribeWidget.querySelector('.phone');
// const unsubscribeBtn = subscribeWidget.querySelector('.unsubscribe-btn');

// subscribeForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   const body = new FormData(subscribeForm);

//   const xhr = new XMLHttpRequest();

//   xhr.onreadystatechange = function() {
//     if (xhr.readyState !== 4) return;

//     console.log(xhr.responseText);
//   }

//   xhr.open('POST', 'http://localhost:7070');

//   xhr.send(body);
// });

// unsubscribeBtn.addEventListener('click', (e) => {
//   e.preventDefault();

//   const body = Array.from(subscribeForm.elements)
//     .filter(({ name }) => name)
//     .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
//     .join('&');

//   const xhr = new XMLHttpRequest();

//   xhr.onreadystatechange = function() {
//     if (xhr.readyState !== 4) return;

//     console.log(xhr.responseText);
//   }

//   xhr.open('DELETE', 'http://localhost:7070' + body);

//   xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

//   xhr.send();
// });

// const uploadForm = document.querySelector('.upload-form');
// const previewImage = document.querySelector('.preview-image');

// uploadForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   const body = new FormData(uploadForm);

//   const xhr = new XMLHttpRequest();

//   xhr.onreadystatechange = function() {
//     if (xhr.readyState !== 4) return;

//     console.log(xhr.responseText);
//     previewImage.src = 'http://localhost:7070' + xhr.responseText;
//   }

//   xhr.open('POST', 'http://localhost:7070/upload');

//   xhr.send(body);
// });

console.log('app.js is bunled');
