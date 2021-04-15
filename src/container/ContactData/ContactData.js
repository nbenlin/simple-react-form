import React, { Component } from "react";

import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import "./ContactData.css";
import axios from "../../axios";
import Input from "../../components/UI/Input/Input";

import ImageUploader from "react-images-upload";

class ContactData extends Component {
  state = {
    formData: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Imie",
        },
        value: "",
        validation: {
          required: true,
          minLength: 3,
          maxLength: 12,
        },
        valid: false,
      },
      surname: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Nazwisko",
        },
        value: "",
        validation: {
          required: true,
          minLength: 3,
          maxLength: 12,
        },
        valid: false,
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Adres e mail",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
      },
      identificationNumber: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Pesel lub NIP",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
      },
      personType: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "osoba", displayValue: "osoba" },
            { value: "firma", displayValue: "firma" },
          ],
        },
        value: "",
        validation: {},
        valid: true,
      },
    },
    formIsValid: false,
    loading: false,
    picture: [],
    error: false,
  };

  onDrop = (picture) => {
    this.setState({ picture: picture });
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    return isValid;
  }

  formHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.formData) {
      formData[formElementIdentifier] = this.state.formData[
        formElementIdentifier
      ].value;
    }
    const personData = {
      formData: formData,
      author: this.state.author,
    };
    axios
      .post("/Contractor/save", personData)
      .then((response) => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ error: true, loading: false });
      });
  };

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedPersonData = {
      ...this.state.formData,
    };
    const updatedFormElement = {
      ...updatedPersonData[inputIdentifier],
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedPersonData[inputIdentifier] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedPersonData) {
      formIsValid = updatedPersonData[inputIdentifier].valid && formIsValid;
    }
    this.setState({ formData: updatedPersonData, formIsValid: formIsValid });
  };

  render() {
    let messageToUser = (
      <p className="errorMessage">
        Nie znaleziono metody zapisu, przepraszamy :(
      </p>
    );
    if (this.state.error) {
    }
    const formElementsArray = [];
    for (let key in this.state.formData) {
      formElementsArray.push({
        id: key,
        config: this.state.formData[key],
      });
    }
    let form = (
      <form onSubmit={this.formHandler}>
        {formElementsArray.map((formElement) => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <Button disabled={!this.state.formIsValid}>Wyślij</Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className="ContactData">
        {this.state.error ? messageToUser : ""}
        <h4>Proszę wprowadź swoje dane kontaktowe</h4>
        <small className="smallText">
          Upewnij się że wypełniłeś wszystko żeby przycisk zadziała
        </small>
        <ImageUploader
          withIcon={true}
          onChange={this.onDrop}
          maxFileSize={5242880}
        />
        {form}
      </div>
    );
  }
}

export default ContactData;
