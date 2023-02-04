import RenderingNote from './RenderingNote';
import Tooltip from './Tooltip';

export default class Popup {
  constructor(storage) {
    this.container = null;
    this.input = document.querySelector('.input_name');
    this.textArea = document.querySelector('.textarea_description');
    this.update = false;
    this.activEvent = null;
    this.renderingNote = new RenderingNote();
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

      formPopup.setAttribute('novalidate', true);
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

    const id = performance.now();
    this.data[id] = {};
    this.data[id].id = id;
    this.data[id].name = inputName.value;
    this.data[id].description = textAreaDescription.value;
    this.data[id].status = false;
    this.data[id].created = Popup.getCreationDate();

    this.storage.save(this.data);
    this.renderingNote.action(this.data[id]);
  }

  preUpdateNote(listEditor) {
    if (this.container) {
      this.openPopup(this.container);
    } else {
      this.openPopup(document.querySelector('.app_container'));
      this.activEvent = document.querySelector('.btn_update_img');
    }

    const inputName = document.querySelector('.input_name');
    const textAreaDescription = document.querySelector('.textarea_description');

    inputName.value = listEditor.querySelector('.name_title').textContent;
    textAreaDescription.value = listEditor.querySelector('.description').textContent;

    this.update = true;
  }

  updateNote() {
    const actualId = this.activEvent.closest('.list_editor').getAttribute('id');

    const inputName = document.querySelector('.input_name');
    const textAreaDescription = document.querySelector('.textarea_description');

    const name = this.activEvent.closest('.list_editor').querySelector('.name_title');
    const description = this.activEvent.closest('.list_editor').querySelector('.description');

    name.textContent = inputName.value;
    description.textContent = textAreaDescription.value;

    this.data[actualId].name = name.textContent;
    this.data[actualId].description = description.textContent;

    this.storage.save(this.data);

    this.update = false;
  }
}
