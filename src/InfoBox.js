import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from "@material-ui/core";

import "./InfoBox.css";

function InfoBox({ title, color, cases, total, active, ...props }) {
  const getColor = (position) => {
    if (title === "Coronavirus Cases")
      return { borderColor: "rgba(204,16,52, 0.5)" };
    else if (title === "Recovered")
      return { borderColor: "rgba(125, 215, 29, 0.5)" };
    else return { borderColor: "rgb(105,105,105)" };
  };

  return (
   <CardActionArea>
      <Card waves="light"
        onClick={props.onClick}
        className={`infoBox ${active && "infoBox--selected"} 
      }`}
        style={{ borderColor: color }}
      >
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            <h3>{title}</h3>
          </Typography>

          <h2 className="infoBox__cases" style={{ color: color }}>
            {cases}
          </h2>

          <Typography className="infoBox__total" color="textSecondary">
            {total} Total
          </Typography>
        </CardContent>
      </Card></CardActionArea>
  );
}

export default InfoBox;
