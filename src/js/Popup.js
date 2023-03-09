import Tooltip from './Tooltip';
import openDeletModal from './openDeletModal';
import edit from '../img/update.png';

export default class Popup {
  constructor(storage) {
    this.container = null;
    this.input = document.querySelector('.input_name');
    this.textArea = document.querySelector('.textarea_description');
    this.update = false;
    this.updateTicket = null;
    this.tooltipFactory = new Tooltip();
    this.storage = storage;
    this.data = this.storage.load();
  }

  openPopup(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this.container = container;
    if (!document.querySelector('.popup_container')) {
      const containerPopup = document.createElement('DIV');
      const formPopup = document.createElement('FORM');
      const popupControlName = document.createElement('DIV');
      const paragraphName = document.createElement('P');
      const inputName = document.createElement('INPUT');
      const popupDescription = document.createElement('DIV');
      const paragraphDescription = document.createElement('P');
      const textAreaDescription = document.createElement('TEXTAREA');
      const containerBtn = document.createElement('DIV');
      const btnCancel = document.createElement('BUTTON');
      const btnSave = document.createElement('BUTTON');

      formPopup.classList.add('form_popup');
      formPopup.setAttribute('novalidate', true);
      formPopup.method = 'POST';
      formPopup.action = 'http://localhost:7070';
      containerPopup.classList.add('popup_container');
      popupControlName.classList.add('popup-control');
      popupDescription.classList.add('popup-control');
      paragraphName.classList.add('Input_text');
      paragraphName.textContent = 'Краткое описание';
      paragraphDescription.classList.add('Input_text');
      paragraphDescription.textContent = 'Подробное описание';
      inputName.classList.add('input_name');
      inputName.setAttribute('required', true);
      inputName.name = 'name';
      textAreaDescription.classList.add('textarea_description');
      textAreaDescription.setAttribute('required', true);
      textAreaDescription.name = 'description';

      containerBtn.classList.add('popup-btn');
      btnCancel.classList.add('btn');
      btnCancel.classList.add('btn_cancel');
      btnCancel.textContent = 'Отмена';

      btnSave.classList.add('btn');
      btnSave.classList.add('btn_save');
      btnSave.textContent = 'Сохранить';

      document.body.appendChild(containerPopup);
      containerPopup.prepend(formPopup);

      containerBtn.prepend(btnCancel);
      containerBtn.prepend(btnSave);
      formPopup.prepend(containerBtn);

      popupDescription.prepend(textAreaDescription);
      popupDescription.prepend(paragraphDescription);
      formPopup.prepend(popupDescription);

      popupControlName.prepend(inputName);
      popupControlName.prepend(paragraphName);
      formPopup.prepend(popupControlName);

      btnCancel.addEventListener('click', (e) => {
        e.preventDefault();

        this.updateTicket = null;
        this.update = false;
        Popup.closePopup();
      });

      let actualMessages = [];

      const showTooltip = (message, el) => {
        actualMessages.push({
          name: el.name,
          id: this.tooltipFactory.showTooltip(message, el),
        });
      };

      formPopup.addEventListener('submit', (e) => {
        e.preventDefault();

        actualMessages.forEach((message) => this.tooltipFactory.removeTooltip(message.id));
        actualMessages = [];

        if (formPopup.checkValidity()) {
          if (!this.update) {
            this.saveInputNote();
            Popup.closePopup();
          }
          if (this.update) {
            this.updateNote();
            Popup.closePopup();
          }
        } else {
          const { elements } = formPopup;

          [...elements].forEach((elem) => {
            const error = Popup.getError(elem);

            if (error) {
              showTooltip(error, elem);
            }
          });
        }
      });

      const elementOnBlur = (e) => {
        const el = e.target;

        const error = Popup.getError(el);
        if (error) {
          showTooltip(error, el);
        } else {
          const currentErrorMessage = actualMessages.find((item) => item.name === el.name);

          if (currentErrorMessage) {
            this.tooltipFactory.removeTooltip(currentErrorMessage.id);
          }
        }

        el.removeEventListener('blur', elementOnBlur);
      };

      Array.from(formPopup.elements).forEach((el) => el.addEventListener('focus', () => {
        el.addEventListener('blur', elementOnBlur);
      }));
    }
  }

  renderingNote(item) {
    const editor = document.querySelector('.list_editor_container');
    const listEditor = document.createElement('UL');
    const liStatus = document.createElement('LI');
    const statusBox = document.createElement('DIV');
    const liName = document.createElement('LI');
    const paragraphName = document.createElement('P');
    const paragraphDescription = document.createElement('P');
    const liCreated = document.createElement('LI');
    const paragraphCreated = document.createElement('P');
    const liActionEdit = document.createElement('LI');
    const btnUpdate = document.createElement('IMG');
    const btnDelete = document.createElement('DIV');

    listEditor.classList.add('list_editor');
    listEditor.setAttribute('id', item.id);
    liStatus.classList.add('status');
    statusBox.classList.add('ticket_status');
    statusBox.setAttribute('status', item.status);
    if (statusBox.getAttribute('status') === 'true') {
      statusBox.textContent = '\u2713';
    }

    liName.classList.add('name');
    paragraphName.classList.add('name_title');
    paragraphDescription.classList.add('description');
    paragraphDescription.classList.add('display_none');

    liCreated.classList.add('created');
    paragraphCreated.classList.add('date_of_creation');
    liActionEdit.classList.add('action_edit');
    btnUpdate.classList.add('btn_update_img');
    btnDelete.classList.add('btn_delete');

    paragraphName.textContent = item.name;
    // paragraphDescription.textContent = item.description;
    paragraphCreated.textContent = item.created;
    btnUpdate.src = edit;
    btnDelete.textContent = 'x';

    editor.appendChild(listEditor);
    liActionEdit.prepend(btnDelete);
    liActionEdit.prepend(btnUpdate);
    listEditor.prepend(liActionEdit);
    liCreated.prepend(paragraphCreated);
    listEditor.prepend(liCreated);
    liName.prepend(paragraphDescription);
    liName.prepend(paragraphName);
    listEditor.prepend(liName);
    liStatus.prepend(statusBox);
    listEditor.prepend(liStatus);

    btnUpdate.addEventListener('click', (e) => {
      console.log(e);
      this.updateTicket = btnUpdate.closest('.list_editor');
      this.preUpdateNote(this.updateTicket);
      this.activEvent = e.target;
    });
    btnDelete.addEventListener('click', () => {
      console.log(btnDelete.closest('.list_editor'));
      openDeletModal(btnDelete.closest('.list_editor'));
    });

    statusBox.addEventListener('click', () => {
      const xhr = new XMLHttpRequest();

      xhr.open('POST', 'https://helpdesk-backend-rxb4.onrender.com/statusChanged');

      xhr.send(statusBox.closest('.list_editor').getAttribute('id'));

      if (statusBox.textContent === '') {
        statusBox.textContent = '\u2713';
        statusBox.setAttribute('status', 'true');
        // this.storage.statusChange(statusBox.closest('.list_editor').getAttribute('id'), true);
      } else {
        statusBox.textContent = '';
        statusBox.setAttribute('status', 'false');
        // this.storage.statusChange(statusBox.closest('.list_editor').getAttribute('id'), false);
      }
    });

    liName.addEventListener('click', () => {
      if (paragraphDescription.classList.contains('display_none')) {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', 'https://helpdesk-backend-rxb4.onrender.com/ticketById');
        console.log(liName.closest('.list_editor').getAttribute('id'));
        xhr.send(liName.closest('.list_editor').getAttribute('id'));

        xhr.addEventListener('load', () => {
          const description = JSON.parse(xhr.responseText);
          paragraphDescription.textContent = description;
        });
        paragraphDescription.classList.remove('display_none');
      } else {
        paragraphDescription.classList.add('display_none');
      }
    });
  }

  static getError(el) {
    const errors = {
      name: {
        valueMissing: 'Заполните, пожалуйста, поле "Краткое описание"',
      },
      description: {
        valueMissing: 'Заполните, пожалуйста, поле "Подробное описание"',
      },
    };

    const errorKey = Object.keys(ValidityState.prototype).find((key) => {
      if (!el.name) return null;
      if (key === 'valid') return null;

      return el.validity[key];
    });

    if (!errorKey) return null;

    return errors[el.name][errorKey];
  }

  static getCreationDate() {
    const date = new Date();
    let dateHours = date.getHours();
    let dateMinutes = date.getMinutes();
    let dateDay = date.getDate();
    let dateMonth = date.getMonth() + 1;
    if (dateHours < 10) {
      dateHours = `0${dateHours}`;
    }
    if (dateMinutes < 10) {
      dateMinutes = `0${dateMinutes}`;
    }
    if (dateDay < 10) {
      dateDay = `0${dateDay}`;
    }
    if (dateMonth < 10) {
      dateMonth = `0${dateMonth}`;
    }
    return `${dateDay}.${dateMonth}.${date.getFullYear()} ${dateHours}:${dateMinutes}`;
  }

  static closePopup() {
    document.querySelectorAll('.form-error').forEach((item) => item.remove());
    document.querySelector('.popup_container').remove();
  }

  saveInputNote() {
    const inputName = document.querySelector('.input_name');
    const textAreaDescription = document.querySelector('.textarea_description');

    if (this.data === null) {
      this.data = {};
    }

    // const id = performance.now();
    // this.data[id] = {};
    // this.data[id].id = id;
    // this.data[id].name = inputName.value;
    // this.data[id].description = textAreaDescription.value;
    // this.data[id].status = false;
    // this.data[id].created = Popup.getCreationDate();

    const body = {
      name: inputName.value,
      description: textAreaDescription.value,
    };

    // for (let key of Object.keys(this.data[id])) {
    //   body.push(key + " & " + encodeURIComponent(this.data[id][key]))
    // }

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      console.log(xhr.responseText);
    };

    xhr.open('PUT', 'https://helpdesk-backend-rxb4.onrender.com/createNewTicket');

    xhr.send(JSON.stringify(body));

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          this.renderingNote(data);
        } catch (e) {
          console.error(e);
        }
      }
    });

    // this.storage.save(this.data);
  }

  preUpdateNote(listEditor) {
    this.openPopup(document.querySelector('.app_container'));
    const actualId = listEditor.closest('.list_editor').getAttribute('id');

    const inputName = document.querySelector('.input_name');
    const textAreaDescription = document.querySelector('.textarea_description');

    inputName.value = listEditor.querySelector('.name_title').textContent;

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      console.log(xhr.responseText);
    };

    xhr.open('POST', 'https://helpdesk-backend-rxb4.onrender.com/ticketById');

    xhr.send(actualId);

    xhr.addEventListener('load', () => {
      textAreaDescription.value = JSON.parse(xhr.responseText);
    });

    // textAreaDescription.value = listEditor.querySelector('.description').textContent;

    this.update = true;
  }

  updateNote() {
    const actualId = this.updateTicket.closest('.list_editor').getAttribute('id');

    const inputName = document.querySelector('.input_name');
    const textAreaDescription = document.querySelector('.textarea_description');

    const name = this.updateTicket.closest('.list_editor').querySelector('.name_title');
    const description = this.updateTicket.closest('.list_editor').querySelector('.description');

    // this.data[actualId].name = name.textContent;
    // this.data[actualId].description = description.textContent;

    const xhr = new XMLHttpRequest();

    const body = {
      id: actualId,
      name: inputName.value,
      description: textAreaDescription.value,
    };

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      console.log(xhr.responseText);
    };

    xhr.open('PATCH', 'https://helpdesk-backend-rxb4.onrender.com/updateTicket');

    xhr.send(JSON.stringify(body));

    xhr.addEventListener('load', () => {
      name.textContent = JSON.parse(xhr.responseText).name;
      description.textContent = JSON.parse(xhr.responseText).description;
    });

    // this.storage.save(this.data);

    this.update = false;
  }
}
