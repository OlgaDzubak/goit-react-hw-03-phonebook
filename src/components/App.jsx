import { Component } from 'react';
import {ContactForm} from './ContactForm/contact_form';
import {ContactList} from './ContactList/contact_list';
import {Filter} from './Filter/filter';
import { Notify } from 'notiflix';
import './App.css';

export class App extends Component {
   
  state = {
    contacts: [],
    filter: '',
  }

  onFilterInputChange = (evt) => this.setState({filter: evt.target.value});

  onClickToAddBtn = (form_data) => {
        const addedName = form_data.name;
        const addedNumber = form_data.number;
        const addedId = "id-" + (this.state.contacts.length+1).toString();
        
        if (this.state.contacts.some(contact => contact.name === addedName)) {
          Notify.failure(`${addedName} is already in contacts.`);
        }else { 
          this.setState(prevState => {return {contacts: [...prevState.contacts, {id:addedId, name:addedName, number:addedNumber}]}});
          Notify.success(`${addedName} was added to the contact list.`);
        }
  };

  onClickDelBtn = (evt) => { 
    this.setState(prevState => { return {contacts: prevState.contacts.filter(contact => contact.id !== evt.target.name)}});
  };

  filterContacts = () => {return this.state.contacts.filter((contact) => contact.name.toLowerCase().includes(this.state.filter.toLowerCase().trim()))};

  componentDidMount(){

    const contactsFromLStorage = localStorage.getItem('contacts');
    const parsedContactsFromLStorage = JSON.parse(contactsFromLStorage);

    if (contactsFromLStorage) {
      this.setState({contacts: parsedContactsFromLStorage});
    }
  }

  componentDidUpdate(prevProps, prevState){

    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts',JSON.stringify(this.state.contacts));
    }
  }

  render(){ 
    return (
      <section className='section'>
        <div className='app_div'>

          <h1>Phonebook</h1>
          <ContactForm onClickToAddBtn={this.onClickToAddBtn} />

          <h2>Contacts</h2>
          <Filter onInputChange={this.onFilterInputChange} />
          <ContactList contacts={this.filterContacts()} onClickDelBtn={this.onClickDelBtn} />

        </div>
      </section>
    )
  }
};
