import { Component } from "react";
import FilterComponent from "./FilterComponent";
import Grid from "./Grid";

//Listing je parent component pre Filter a Grid, ak sa pracuje s Filtrom, vyvola event u rodica,
//ktoremu sa zmeni stav a pri zmene sa znova renderuje a tak sa posle hodnota aj ku komponentu Grid
class Listing extends Component {
  constructor() {
    super();
    this.state = {
      position: "",
      contract: "",
      active: "",
      text: "",
    };

    this.handleGridPositionChange = this.handleGridPositionChange.bind(this);
    this.handleGridActiveChange = this.handleGridActiveChange.bind(this);
    this.handleGridContractChange = this.handleGridContractChange.bind(this);
    this.handleClearFilter = this.handleClearFilter.bind(this);
    this.hangleGridTextChange = this.hangleGridTextChange.bind(this);
  }

  handleGridPositionChange = (pos) => {
    this.setState({ position: pos });
  };

  handleGridContractChange = (contr) => {
    this.setState({ contract: contr });
  };

  handleGridActiveChange = (active) => {
    this.setState({ active: active });
  };

  hangleGridTextChange = (text) => {
    this.setState({ text: text });
  };

  handleClearFilter = () => {
    this.setState({ text: "" });
    this.setState({ active: "" });
    this.setState({ contract: "" });
    this.setState({ position: "" });
  };

  render() {
    return (
      <div className="container">
        <FilterComponent
          positionFiltering={this.handleGridPositionChange}
          contractFiltering={this.handleGridContractChange}
          activeFiltering={this.handleGridActiveChange}
          textFiltering={this.hangleGridTextChange}
          clearFilter={this.handleClearFilter}
        ></FilterComponent>
        <Grid
          positionFiltered={this.state.position}
          contractFiltered={this.state.contract}
          activeFiltered={this.state.active}
          textFiltered={this.state.text}
        ></Grid>
      </div>
    );
  }
}
export default Listing;
