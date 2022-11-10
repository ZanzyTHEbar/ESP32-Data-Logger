import { BsGraphDown } from "react-icons/bs";
import {
    FaServer,
    FaLink,
    FaPencilAlt,
    FaEyeDropper,
    FaIdBadge,
    FaClock,
} from "react-icons/fa";
//import * as AiIcons from 'react-icons/ai';
//import * as IoIcons from 'react-icons/io';
//https://react-icons.github.io/react-icons/

export const SettingsPageData = [
    {
        title: "IP Address",
        icon: <FaServer />,
        cName: "nav-text",
        id: "ip",
        tooltip: "IP Address of the server",
        placeholder: "http://humiditysensor.local",
    },
    {
        title: "Endpoint",
        icon: <FaLink />,
        cName: "nav-text",
        id: "endpoint",
        tooltip: "Endpoint of the server",
        placeholder: "/api/v1/humidity",
    },
    {
        title: "Chart Title",
        icon: <FaPencilAlt />,
        cName: "nav-text",
        id: "title",
        tooltip: "Title of the graph",
        placeholder: "Kitchen Humidity Data",
    },
    {
        title: "Y Axis Title",
        icon: <BsGraphDown />,
        cName: "nav-text",
        id: "y_axis_title",
        tooltip: "Y Axis Title",
        placeholder: "Humidity (%)",
    },
    {
        title: "Color",
        icon: <FaEyeDropper />,
        cName: "nav-text",
        id: "line_color",
        tooltip: "Graph Line Color",
        placeholder: "#FF0000",
    },
    {
        title: "JSON ID",
        icon: <FaIdBadge />,
        cName: "nav-text",
        id: "object_id",
        tooltip: "The object member name from the JSON data",
        placeholder: "humidity_dht",
    },
    {
        title: "Interval (ms)",
        icon: <FaClock />,
        cName: "nav-text",
        id: "interval",
        tooltip: "The interval in milliseconds to update the graph",
        placeholder: "3000",
    },
];
