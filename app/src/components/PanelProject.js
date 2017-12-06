import React, { Component } from "react";
import {
  InputGroup,
  InputGroupButton,
  InputGroupAddon,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from "reactstrap";

export default class PanelProject extends Component {
  constructor(props) {
    super(props);
    this.clickSelectDirector = this.clickSelectDirector.bind(this);
  }

  clickSelectDirector(){
      this.refs.fileUploader.click();
  }


  
  render() {
    return (
      <div>
        <div className="panel-label">Project Structure</div>
        <InputGroup>
          <InputGroupAddon>@</InputGroupAddon>
          <Button onClick={this.clickSelectDirector}>Upload</Button>
          <input type="file" id="file" ref="fileUploader" style={{display: "none"}}/>
        </InputGroup>
        <br />
        <InputGroup>
          <InputGroupAddon>
            <Input
              addon
              type="checkbox"
              aria-label="Checkbox for following text input"
            />
          </InputGroupAddon>
          <Input placeholder="Check it out" />
        </InputGroup>
        <br />
        <InputGroup>
          <Input placeholder="username" />
          <InputGroupAddon>@example.com</InputGroupAddon>
        </InputGroup>
        <br />
        <InputGroup>
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupAddon>$</InputGroupAddon>
          <Input placeholder="Dolla dolla billz yo!" />
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupAddon>$</InputGroupAddon>
        </InputGroup>
        <br />
        <InputGroup>
          <InputGroupAddon>$</InputGroupAddon>
          <Input placeholder="Amount" type="number" step="1" />
          <InputGroupAddon>.00</InputGroupAddon>
        </InputGroup>
      </div>
    );
  }
}
