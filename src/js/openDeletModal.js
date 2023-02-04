import Storage from './Storage';

export default function openDeletModal(ticket) {
  const modal = document.createElement('DIV');
  const containerModal = document.createElement('DIV');
  const modalHeader = document.createElement('H1');
  const modalParagraph = document.createElement('P');

  const containerBtn = document.createElement('DIV');
  const btnCancel = document.createElement('BUTTON');
  const btnAgree = document.createElement('BUTTON');

  modal.classList.add('popup_container');
  modalParagraph.classList.add('Input_text');
  modalHeader.textContent = 'Удалить тикет';
  modalParagraph.textContent = 'Вы уверены, что хотите удалить тикет? Это действие необратимо.';

  containerBtn.classList.add('popup-btn');
  btnCancel.classList.add('btn');
  btnCancel.classList.add('btn_cancel');
  btnCancel.textContent = 'Отмена';

  btnAgree.classList.add('btn');
  btnAgree.textContent = 'Ok';

  document.body.appendChild(modal);
  modal.prepend(containerModal);

  containerBtn.prepend(btnAgree);
  containerBtn.prepend(btnCancel);
  containerModal.prepend(containerBtn);

  containerModal.prepend(modalParagraph);
  containerModal.prepend(modalHeader);

  btnCancel.addEventListener('click', () => document.querySelector('.popup_container').remove());

  btnAgree.addEventListener('click', () => {
    new Storage().removeTicket(ticket.getAttribute('id'));
    ticket.remove();
    document.querySelector('.popup_container').remove();
  });
}
