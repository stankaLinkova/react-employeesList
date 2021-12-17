import React, { Component } from "react";
import DataTable from "react-data-table-component";
import {
  getEmployeeById,
  getPositions,
  getContractTypes,
} from "../services/employeeService";
import { Navigate } from "react-router-dom";
import "../App.css";

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoaded: false,
      name: "",
      position: "",
      id: null,
      contractTypes: [],
      goBack: false,
    };

    //definujeme si, ake stlpce chceme mat
    this.columns = [
      {
        name: "ID",
        selector: (row) => row.id,
        sortable: true,
      },
      {
        name: "Contract Type",
        selector: (row) =>
          this.state.contractTypes.map((contract) => {
            if (contract.id === row.typeId) {
              return contract.name;
            } else {
              return false;
            }
          }),
        sortable: true,
      },
      {
        name: "Contract From",
        selector: (row) => new Date(row.from).toLocaleDateString("sk-SK"),
        sortable: true,
      },
      {
        name: "Contract To",
        selector: (row) =>
          row.to !== null
            ? new Date(row.to).toLocaleDateString("sk-SK")
            : false,
        sortable: true,
      },
    ];
    this.handleButton = this.handleButton.bind(this);
  }

  // vdaka buttonu sa vratime ku vsetkym zamestnancom
  handleButton = async () => {
    this.setState({ goBack: true });
  };

  // ked nastane component did mount, nacitame potrebne data z API
  async componentDidMount() {
    try {
      //ziskame id zamestnanca
      const id = window.location.pathname.split("/")[2];

      //ziskame zamestnanca a utriedime si jeho contracty od najnovsej
      const person = await getEmployeeById(id);
      const sortedContracts = person.data.contracts.sort((a, b) =>
        a.from < b.from ? 1 : -1
      );
      this.setState({ items: sortedContracts });
      const name = person.data.surname + " " + person.data.name;
      this.setState({ name: name });
      this.setState({ id: person.data.id });

      //potrebujeme ziskat aj pozicie podla id
      const positions = await getPositions();
      const positionP = positions.data.map((position) =>
        position.id === person.data.positionId ? position.name : false
      );

      //contracty
      const contractTypes = await getContractTypes();
      this.setState({ contractTypes: contractTypes.data });

      this.setState({ position: positionP });
      this.setState({ isLoaded: true });
    } catch (error) {}
  }

  render() {
    if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        //ak mame data nacitane, mozeme ich zobrazit do tabulky
        <div className="container">
          {this.state.goBack && <Navigate to="/" />}
          <div>
            <p>ID: {this.state.id} </p>
            <p>Name: {this.state.name}</p>
            <p>Position: {this.state.position} </p>
          </div>

          <DataTable
            title={"DETAIL"}
            columns={this.columns}
            data={this.state.items}
            highlightOnHover
          />

          <div className="container mt-5 mb-2">
            <div className="row">
              <div className="col"></div>
              <div className="col">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={this.handleButton}
                >
                  Go back to all employees
                </button>
              </div>
              <div className="col"></div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Detail;
