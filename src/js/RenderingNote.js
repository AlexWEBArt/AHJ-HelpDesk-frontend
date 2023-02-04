import openDeletModal from './openDeletModal';
import edit from '../img/update.png';

export default class RenderingNote {
  constructor(storage, popup) {
    this.storage = storage;
    this.popup = popup;
  }

  action(item) {
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
    paragraphDescription.textContent = item.description;
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
      this.popup.preUpdateNote(btnUpdate.closest('.list_editor'));
      this.popup.activEvent = e.target;
    });
    btnDelete.addEventListener('click', () => {
      openDeletModal(btnDelete.closest('.list_editor'));
    });

    statusBox.addEventListener('click', () => {
      if (statusBox.textContent === '') {
        statusBox.textContent = '\u2713';
        statusBox.setAttribute('status', 'true');
        this.storage.statusChange(statusBox.closest('.list_editor').getAttribute('id'), true);
      } else {
        statusBox.textContent = '';
        statusBox.setAttribute('status', 'false');
        this.storage.statusChange(statusBox.closest('.list_editor').getAttribute('id'), false);
      }
    });

    liName.addEventListener('click', () => {
      if (paragraphDescription.classList.contains('display_none')) {
        paragraphDescription.classList.remove('display_none');
      } else {
        paragraphDescription.classList.add('display_none');
      }
    });
  }
}
