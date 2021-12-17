import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import { getPositions, getContractTypes } from "../services/employeeService";

class FilterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positions: [],
      contractTypes: [],
      positionSelected: "",
      contractSelected: "",
      activeSelected: "",
      textSelected: "",
    };

    this.handlePositions = this.handlePositions.bind(this);
    this.handleContracts = this.handleContracts.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleClearFilter = this.handleClearFilter.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  async componentDidMount() {
    try {
      //natiahneme pozicie a contracty z API, potom ich usporiadame aby sme ich take mohli zobrazovat v dropdowne
      const positions = await getPositions();
      const sortedPositions = positions.data.sort((a, b) => (a.name > b.name) ? 1 : -1);
      this.setState({ positions: sortedPositions });

      const contractTypes = await getContractTypes();
      const sortedContracts = contractTypes.data.sort((a, b) => (a.name > b.name) ? 1 : -1);
      this.setState({ contractTypes: sortedContracts });
    } catch (error) {}
  }

  //tato funkcia sa vykona, ak si vyberieme jeden typ pozicie, podla ktorej chceme filtorvat zamestnancov
  handlePositions = (e) => {
    this.setState({ positionSelected: e.target.value });
    const positionId = this.state.positions.filter(
      (pos) => pos.name === e.target.value
    )[0].id; 
    //ak sme ziskali pozitionId, posleme ho parent componentu "Listing"
    this.props.positionFiltering(positionId);
  };

  //funkcia sa spusti, ak sme si vybrali jeden typ contractu na filtrovanie
  handleContracts = (e) => {
    this.setState({ contractSelected: e.target.value });
    const contractId = this.state.contractTypes.filter(
      (con) => con.name === e.target.value
    )[0].id;
    //posuvame contractId parentovi
    this.props.contractFiltering(contractId);
  };

  //ak vyberame active/inactive/all
  handleActive = (e) => {
    this.setState({ activeSelected: e.target.value });
    this.props.activeFiltering(e.target.value);
  };

  //vyhladavanie podla textu
  handleTextChange = (e) => {
    this.setState({ textSelected: e.target.value });
    this.props.textFiltering(e.target.value);
  };

  //ak chceme vycistit filter, vsetky hodnoty nastavime na default ""
  handleClearFilter = () => {
    this.setState({ textSelected: "" });
    this.setState({ activeSelected: "" });
    this.setState({ contractSelected: "" });
    this.setState({ positionSelected: "" });
    this.props.clearFilter();
  };

  // touto funkciou vytvarame dynamicky options v dropdown menu
  createPositionMenu = () => {
    let itemsPositions = [];
    this.state.positions.map((position) =>
      itemsPositions.push(
        <option
          className="dropdown-item"
          key={position.id}
          value={position.name}
        >
          {position.name}
        </option>
      )
    );
    return itemsPositions;
  };

  //dynamicky vytvarame options podla velkosti contractTypes pola
  createContractMenu = () => {
    let itemsContracts = [];
    this.state.contractTypes.map((contract) =>
      itemsContracts.push(
        <option
          className="dropdown-item"
          key={contract.id}
          value={contract.name}
        >
          {contract.name}
        </option>
      )
    );
    return itemsContracts;
  };

  render() {
    return (
      <div className="container">
        <div className="container mt-5 mb-2">
          <div className="row">
            <div className="col">
              <div>
                <select
                  className="btn btn-secondary dropdown-toggle"
                  title="Positions"
                  value={this.state.positionSelected}
                  onChange={this.handlePositions}
                >
                  {this.createPositionMenu()}
                </select>
              </div>
            </div>

            <div className="col">
              <div>
                <select
                  className="btn btn-secondary dropdown-toggle"
                  title="Contracts"
                  value={this.state.contractSelected}
                  onChange={this.handleContracts}
                >
                  {this.createContractMenu()}
                </select>
              </div>
            </div>
            <div className="col">
              <div>
                <select
                  className="btn btn-secondary dropdown-toggle"
                  title="Active"
                  value={this.state.activeSelected}
                  onChange={this.handleActive}
                >
                  <option className="dropdown-item" key={1} value={"all"}>
                    All
                  </option>

                  <option className="dropdown-item" key={2} value={"active"}>
                    Active
                  </option>

                  <option className="dropdown-item" key={3} value={"inactive"}>
                    Inactive
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="container mt-3">
            <div className="row">
              <div className="col"></div>
              <div className="col">
                <div
                  className="form-floating"
                  value={this.state.textSelected}
                  onChange={this.handleTextChange}
                >
                  <textarea
                    className="form-control"
                    placeholder=""
                    id="floatingTextarea"
                  ></textarea>
                  <label>Filter</label>
                </div>
              </div>
              <div className="col"></div>
            </div>
          </div>
        </div>
        {(this.state.positionSelected ||
          this.state.contractSelected ||
          this.state.activeSelected ||
          this.state.textSelected) && (
          <div className="container mt-2 mb-2">
            <button
              className="btn btn-secondary"
              onClick={this.handleClearFilter}
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>
    );
  }
}
export default FilterComponent;
