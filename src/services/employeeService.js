import http from "./httpService";


const apiUrl = "https://my-json-server.typicode.com/1ohnny/test-api";
const apiPositions = apiUrl + "/positions";
const apiContractTypes = apiUrl + "/contractTypes";
const apiEmployees = apiUrl + "/employees";


export function getPositions() {
  return http.get(apiPositions);
}

export function getContractTypes() {
  return http.get(apiContractTypes);
}

export function getEmployees() {
  return http.get(apiEmployees);
}

export function getEmployeeById(id) {
  return http.get(apiEmployees + '/' + id);
}