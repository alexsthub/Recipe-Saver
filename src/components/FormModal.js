import React, { Component } from "react";
import { Button } from "reactstrap";
import firebase from "firebase/app";

// Class to render the modal to input a new recipe
export default class FormModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      image: null,
      ingredientList: [],
      procedureList: [],
      description: "",
      category: "",
      subcategory: "",
      estimatedTime: "",
      isFavorite: false
    };
  }

  // Handle if new recipe is favorite or not
  handleFavoritePress = () => {
    this.setState({ isFavorite: !this.state.isFavorite });
  };

  // For ingredient and procedure, handle input submit
  handleListSubmit = (newData, type) => {
    if (type === "ingredient") {
      this.setState({ ingredientList: newData });
    } else {
      this.setState({ procedureList: newData });
    }
  };

  // For ingredient and procedure, handle list item removal
  handleDeleteRow = (option, type) => {
    if (type === "ingredient") {
      this.setState({
        ingredientList: this.state.ingredientList.filter(el => el !== option)
      });
    } else {
      this.setState({
        procedureList: this.state.procedureList.filter(el => el !== option)
      });
    }
  };

  // When submitting the form, change the image to base 64 and push a new recipe object to firebase
  handleFormSubmit = event => {
    event.preventDefault();

    if (this.state.title === "") {
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(
      this.state.image ? 
      this.state.image : 
      new Blob(["../recipeImages/default.jpg"], {type: 'image/jpg'})
    );
    reader.onload = () => {
      const base64Image = reader.result;

      const newRecipe = {
        category: this.state.category !== "" ? this.state.category : null,
        description: this.state.description !== "" ? this.state.description : null,
        estimatedTime: this.state.estimatedTime !== "" ? parseInt(this.state.estimatedTime) : null,
        imageName: this.state.image && base64Image ? base64Image : null,
        ingredients: this.state.ingredientList.join("|"),
        procedure: this.state.procedureList.join("|"),
        subcategory: this.state.subcategory !== "" ? this.state.subcategory : null,
        title: this.state.title !== "" ? this.state.title : null,
        times: null,
        isFavorite: this.state.isFavorite
      };
      let recipeRef = firebase.database().ref(this.props.user.uid);
      recipeRef.push(newRecipe);
      this.props.handleFormClose();
    } 
  };

  render() {
    return (
      <div className="form-overlay">
        <form
          onSubmit={this.handleFormSubmit}
          id="recipe-submit"
          action=""
          encType="multipart/form-data"
        >
          <div className="form-container">
            <div className="form-elements-container">
              <span
                onClick={this.props.handleFormClose}
                className="close"
                role="button"
              >
                X
              </span>
              <h1>Enter A New Recipe!</h1>
              <div className="input-container horizontal center">
                <img
                  onClick={this.handleFavoritePress}
                  className="favoriteIcon"
                  alt="favorite star icon"
                  src={
                    this.state.isFavorite
                      ? require("../img/star-true.png")
                      : require("../img/star-false.png")
                  }
                />
                <p id="favorite-text">Click the Star to Mark a Favorite!</p>
              </div>

              <InputContainer
                title={"Recipe Name"}
                id={"title"}
                value={this.state.title}
                onChange={event => this.setState({ title: event.target.value })}
                placeholder={"Recipe Title..."}
                aria-label={"Enter Recipe Name"}
                type={"text"}
                multiLine={false}
                required={true}
              />

              <ImageInputContainer
                title={"Upload an Image (Optional)"}
                file={this.state.image}
                onChange={image => this.setState({ image: image })}
              />

              <ListInputContainer
                title={"Ingredients"}
                type={"ingredient"}
                data={this.state.ingredientList}
                handleSubmit={this.handleListSubmit}
                handleDeleteRow={this.handleDeleteRow}
                id={"procedure-input"}
                placeholder={"Enter a step..."}
                aria-label={"Enter Steps"}
                required={true}
              />

              <ListInputContainer
                title={"Procedure"}
                type={"procedure"}
                data={this.state.procedureList}
                handleSubmit={this.handleListSubmit}
                handleDeleteRow={this.handleDeleteRow}
                id={"ingredient-input"}
                placeholder={"Enter an Ingredient..."}
                aria-label={"Enter Recipe Ingredient"}
                required={true}
              />

              <InputContainer
                title={"Recipe Description"}
                id={"description"}
                value={this.state.description}
                onChange={event =>
                  this.setState({ description: event.target.value })
                }
                placeholder={"Recipe Description..."}
                aria-label={"Enter Recipe Description"}
                multiLine={true}
                rows={5}
              />

              <InputContainer
                title={"Category"}
                id={"category"}
                value={this.state.category}
                onChange={event =>
                  this.setState({ category: event.target.value })
                }
                placeholder={"Recipe Category..."}
                aria-label={"Enter Recipe Category"}
                type={"text"}
              />

              <InputContainer
                title={"Subcategory"}
                id={"subcategory"}
                value={this.state.subcategory}
                onChange={event =>
                  this.setState({ subcategory: event.target.value })
                }
                placeholder={"Recipe Subcategory..."}
                aria-label={"Enter Recipe Subcategory"}
                type={"text"}
              />

              <InputContainer
                title={"Estimated Time in Minutes"}
                id={"time"}
                value={this.state.estimatedTime}
                onChange={event =>
                  this.setState({ estimatedTime: event.target.value })
                }
                placeholder={"Recipe Estimated Time..."}
                aria-label={"Enter Recipe Estimated Time"}
                type={"number"}
              />

              <div className="submit-container">
                <Button onClick={this.handleFormSubmit} color="primary">Submit</Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

// Handle image input by clicking to input an image or dragover
class ImageInputContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { file: null, hasError: false, dragOn: false };
  }

  // Returns True if a string ends with one of the endings provided, otherwise False
  endsWithAny(string, endings) {
    return endings.some(function(ending) {
      return string.endsWith(ending);
    });
  }

  handleFileChange = event => {
    let file = event.target.files[0];
    this.processFile(file);
  };

  // If input file is an image, process file
  processFile = file => {
    if (this.endsWithAny(file.name, ["jpg", "png", "tif", "svg"])) {
      this.setState({ hasError: false });
      this.props.onChange(file);
    } else {
      this.setState({ hasError: true });
    }
  };

  handleDragStart = event => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ dragOn: true });
  };

  handleDragEnd = () => {
    this.setState({ dragOn: false });
  };

  handleDrop = event => {
    event.preventDefault();
    event.stopPropagation();
    this.handleDragEnd();
    let file = event.dataTransfer.files[0];
    this.processFile(file);
  };

  render() {
    return (
      <div className="input-container">
        <p>Upload an Image (Optional)</p>
        <div className="line"></div>
        <div
          className={!this.state.dragOn ? "box" : "box is-dragover"}
          draggable
          onDragOver={this.handleDragStart}
          onDragEnter={this.handleDragStart}
          onDragLeave={this.handleDragEnd}
          onDragEnd={this.handleDragEnd}
          onDrop={this.handleDrop}
        >
          <div className="box-input">
            <input
              onChange={this.handleFileChange}
              type="file"
              name="file"
              id="file"
              className="input-file"
            />
            <label htmlFor="file">
              <div className="input-clickable">
                <img
                  className="box-image"
                  alt="upload"
                  src={require("../img/upload.png")}
                />
                <span>
                  {this.state.hasError ? (
                    <p className="error-message">
                      Invalid File Type. Try again with an image.
                    </p>
                  ) : this.props.file ? (
                    <p>{this.props.file.name}</p>
                  ) : (
                    <p>
                      <strong>Choose a file </strong>or drag it here.
                    </p>
                  )}
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    );
  }
}

// Containers to handle list input
class ListInputContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  // Returns list items
  renderListItems = () => {
    return this.props.data.map((option, i) => {
      return (
        <li key={i} className="list-item">
          <div className="list-item-contents">
            <p>
              {option}
              <img
                role="button"
                onClick={() =>
                  this.props.handleDeleteRow(option, this.props.type)
                }
                alt="delete item"
                src={require("../img/minus.png")}
              />
            </p>
          </div>
        </li>
      );
    });
  };

  renderList() {
    if (this.props.type === "ingredient") {
      return <ul>{this.renderListItems()}</ul>;
    } else {
      return <ol>{this.renderListItems()}</ol>;
    }
  }

  submitInput = () => {
    const newData = this.props.data.concat(this.state.value);
    this.setState({ value: "" });
    this.props.handleSubmit(newData, this.props.type);
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  keyPressed = event => {
    if (event.key === "Enter") {
      this.submitInput();
      event.preventDefault();
    }
  };

  render() {
    return (
      <div className="input-container">
        <p>
          {this.props.required
            ? this.props.title + " *"
            : this.props.title + " (Optional)"}
        </p>
        <div className="line"></div>
        {this.renderList()}
        <div className="list-input">
          <img
            src={
              this.props.type === "ingredient"
                ? require("../img/shoppingCart.png")
                : require("../img/paperclip.png")
            }
            alt={
              this.props.type === "ingredient" ? "shopping cart" : "paperclip"
            }
          />
          <input
            id={this.props.id}
            placeholder={this.props.placeholder}
            aria-label={this.props.ariaLabel}
            type={this.props.type}
            value={this.state.value}
            onChange={this.handleChange}
            onKeyPress={this.keyPressed}
          />
          <p role="button" onClick={this.submitInput} id="ingredient-add">
            Add
          </p>
        </div>
      </div>
    );
  }
}

// Container for input text
class InputContainer extends Component {
  render() {
    return (
      <div className="input-container">
        <p>
          {this.props.required
            ? this.props.title + " *"
            : this.props.title + " (Optional)"}
        </p>
        <div className="line"></div>
        {this.props.multiLine ? (
          <textarea
            id={this.props.id}
            value={this.props.value}
            onChange={this.props.onChange}
            className="recipe-description"
            placeholder={this.props.placeholder}
            rows={this.props.rows}
          />
        ) : (
          <input
            id={this.props.id}
            className="standard-input"
            value={this.props.value}
            onChange={this.props.onChange}
            placeholder={this.props.placeholder}
            aria-label={this.props.ariaLabel}
            type={this.props.type}
            required={this.props.required}
          />
        )}
      </div>
    );
  }
}