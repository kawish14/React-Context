import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default function OLTReports(props) {
  const getOLt = () => {
    axios.get("http://localhost:2000/oltAlarms").then((response) => {
      // response.data.sort((a, b) => a.olt.localeCompare(b.olt))
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";

      const ws = XLSX.utils.json_to_sheet(response.data);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });

      FileSaver.saveAs(data, "Alarm state per OLT" + fileExtension);
    });
  };

  return (
    <>
      <button
        className="basemap-button nav-link"
        value="satellite"
        onClick={getOLt}
      >
        Alarms per OLT
      </button>
    </>
  );
}
