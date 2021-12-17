import React, { Component } from "react";
import DataTable from "react-data-table-component";
import { getEmployees, getPositions } from "../services/employeeService";
import { Navigate } from "react-router-dom";
import "../App.css";

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: props.path,
      items: [],
      isLoaded: false,
      employeesId: null,
      positions: [],
      today: new Date().toISOString().split("T")[0],
    };

    this.columns = [
      {
        name: "ID",
        selector: (row) => row.id,
        sortable: true,
      },
      {
        name: "Meno",
        selector: (row) => row.surname + " " + row.name,
        sortable: true,
      },
      {
        name: "Pozícia",
        selector: (row) =>
          this.state.positions.map((position) => {
            if (position.id === row.positionId) {
              return position.name;
            } else {
              return false;
            }
          }),
        sortable: true,
      },
      {
        name: "Aktívna zmluva",
        selector: (row) => this.addContract(row),
      },
    ];

    this.handleRow = this.handleRow.bind(this);
    this.addContract = this.addContract.bind(this);
  }

  async componentDidMount() {
    const employees = await getEmployees();
    const sortedEmployees = employees.data.sort((a, b) =>
      a.surname > b.surname
        ? 1
        : a.surname === b.surname
        ? a.name > b.name
          ? 1
          : -1
        : -1
    );
    this.setState({ items: sortedEmployees });

    const positions = await getPositions();
    this.setState({ positions: positions.data });

    this.setState({ isLoaded: true });
  }

  //funkcia na vytvorenie pola contractov pre daneho zamestnanca
  addContract = (row) => {
    let contracts = [];
    row.contracts.map((contract) => {
      if (contract.to >= this.state.today) {
        const dateFrom = new Date(contract.from).toLocaleDateString("sk-SK");
        const dateTo = new Date(contract.to).toLocaleDateString("sk-SK");
        contracts.push(dateFrom + " - " + dateTo);
      } else if (contract.to === null) {
        const dateFrom = new Date(contract.from).toLocaleDateString("sk-SK");
        contracts.push(dateFrom + " -");
      }

      return false;
    });

    if (contracts.length === 0) {
      return "-";
    } else {
      return contracts.join(" , ");
    }
  };

  handleRow = async (row) => {
    this.setState({ employeesId: row.id });
  };

  // funkcia na vyplnanie tabulky, podla filtra sa vyplnaju data
  handleEmployeesTable = () => {
    let employees = this.state.items;

    if (this.props.positionFiltered !== "") {
      employees = employees.filter(
        (item) => item.positionId === this.props.positionFiltered
      );
    }

    if (this.props.contractFiltered !== "") {
      employees = employees.filter((item) =>
        item.contracts.some((con) => con.typeId === this.props.contractFiltered)
      );
    }

    if (this.props.activeFiltered === "active") {
      employees = employees.filter((item) =>
        item.contracts.some(
          (con) => con.to >= this.state.today || con.to === null
        )
      );
    }

    if (this.props.activeFiltered === "inactive") {
      employees = employees.filter((item) =>
        item.contracts.every((con) => con.to < this.state.today)
      );
    }

    if (this.props.textFiltered !== "") {
      employees = employees.filter(
        (item) =>
          item.name
            .toLowerCase()
            .includes(this.props.textFiltered.toLowerCase()) ||
          item.surname
            .toLowerCase()
            .includes(this.props.textFiltered.toLowerCase())
      );
    }

    //vracia data, ktore sa zobrazia v tabulke
    return employees;
  };

  render() {
    if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="container">
          {this.state.employeesId !== null && (
            <Navigate to={"/detail/" + this.state.employeesId} />
          )}
          <DataTable
            title={"ZAMESTNANCI"}
            columns={this.columns}
            data={this.handleEmployeesTable()}
            highlightOnHover
            onRowClicked={this.handleRow}
          />
        </div>
      );
    }
  }
}

export default Grid;
