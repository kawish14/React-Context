import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from "react";
import './outageFilter.css'

export default function OutageFilter(props) {
  useEffect(() => {
    console.log(props.layers.Outage);
  });

  return (
    <div className="outageFilter">
    
      <label>Outage Date</label>
      <input type="date" />
      <br />

      <button>Click</button>
    </div>
  );
}
