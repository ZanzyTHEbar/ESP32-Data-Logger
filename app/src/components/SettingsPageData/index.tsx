import React from "react";
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
//import * as AiIcons from 'react-icons/ai';
//import * as IoIcons from 'react-icons/io';
//https://react-icons.github.io/react-icons/

export const SettingsPageData = [
    {
        title: "IP Address",
        icon: <FaIcons.FaServer />,
        cName: "nav-text",
        id: "ip",
        tooltip: "IP Address of the server",
        placeholder: "http://humiditysensor.local",
    },
    {
        title: "Endpoint",
        icon: <FaIcons.FaLink />,
        cName: "nav-text",
        id: "endpoint",
        tooltip: "Endpoint of the server",
        placeholder: "/api/v1/humidity",
    },
    {
        title: "Title",
        icon: <FaIcons.FaPencilAlt />,
        cName: "nav-text",
        id: "title",
        tooltip: "Title of the graph",
        placeholder: "Kitchen Humidity Data",
    },
    {
        title: "Y Axis Title",
        icon: <BsIcons.BsGraphDown />,
        cName: "nav-text",
        id: "y_axis_title",
        tooltip: "Y Axis Title",
        placeholder: "Humidity (%)",
    },
    {
        title: "Line Color",
        icon: <FaIcons.FaEyeDropper />,
        cName: "nav-text",
        id: "line_color",
        tooltip: "Graph Line Color",
        placeholder: "#FF0000",
    },
    {
        title: "Object ID",
        icon: <FaIcons.FaIdBadge />,
        cName: "nav-text",
        id: "object_id",
        tooltip: "The object member name from the JSON data",
        placeholder: "humidity_dht",
    },
    {
        title: "Interval (ms)",
        icon: <FaIcons.FaClock />,
        cName: "nav-text",
        id: "interval",
        tooltip: "The interval in milliseconds to update the graph",
        placeholder: "3000",
    },
];
