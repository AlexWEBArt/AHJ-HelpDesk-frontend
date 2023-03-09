// TODO: write code here

import background from '../img/cell.jpg';
import Storage from './Storage';
import Popup from './Popup';


const storage = new Storage();
// storage.clear()
// const dataBase = storage.load();

document.querySelector('body').style.backgroundImage = `url(${background})`;

const popup = new Popup(storage);
// const renderingNote = new RenderingNote(storage, popup);

const containerPopup = document.querySelector('.app_container');
const btnAdd = document.querySelector('.btn_add');

const xhr = new XMLHttpRequest();

xhr.open('GET', 'https://helpdesk-backend-rxb4.onrender.com/allTickets');
xhr.withCredentials = false;
xhr.send()

xhr.addEventListener('load', () => {
  if (xhr.status >= 200 && xhr.status < 300) {
    try {
      const data = JSON.parse(xhr.responseText);

      if (data !== null) {
        for (const key in data) {
          if (!Object.prototype.hasOwnProperty.call(data, 'key')) {
            popup.renderingNote(data[key]);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
});

// if (dataBase !== null) {
//   for (const key in dataBase) {
//     if (!Object.prototype.hasOwnProperty.call(dataBase, 'key')) {
//       renderingNote.action(dataBase[key]);
//     }
//   }
// }

btnAdd.addEventListener('click', (e) => {
  e.preventDefault();

  popup.openPopup(containerPopup);
});

console.log('app.js is bunled');
