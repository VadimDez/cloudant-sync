import React from "react";

import "./App.css";
import { DB } from "./services/db-service";

class App extends React.Component {
  constructor() {
    super();

    this.state = { objects: [] };

    this.addNewObject = this.addNewObject.bind(this);
    this.getObjects = this.getObjects.bind(this);
  }

  async componentDidMount() {
    try {
      this.db = new DB();
      await this.db.init();

      this.getObjects();

      this.db.setOnChange(this.getObjects);
    } catch (e) {
      console.error(e);
    }
  }

  async getObjects() {
    const objects = await this.db.getObjects();

    this.setState({
      objects: objects
    });
  }

  remove(object) {
    return () => {
      this.db.remove(object);
    };
  }

  addNewObject() {
    this.db.add({
      name: "test"
    });
  }

  render() {
    let objects;

    if (this.state.objects.length) {
      objects = (
        <div>
          {this.state.objects.map(object => {
            return (
              <div key={object._id}>
                <span>{object.name}</span>
                <button onClick={this.remove(object)}>Delete</button>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="App">
        <button type="button" onClick={this.addNewObject}>
          Create new object
        </button>
        {objects}
      </div>
    );
  }
}

export default App;
