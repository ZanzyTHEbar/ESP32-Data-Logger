import { BsGraphDown } from 'solid-icons/bs'
import {
    FaSolidServer,
    FaSolidLink,
    FaSolidPencil,
    FaSolidEyeDropper,
    FaSolidIdBadge,
    FaSolidClock,
} from 'solid-icons/fa'

export const SettingsPageData = [
    {
        title: 'IP Address',
        icon: <FaSolidServer />,
        cName: 'nav-text',
        id: 'ip',
        tooltip: 'IP Address of the server',
        placeholder: 'http://humiditysensor.local',
    },
    {
        title: 'Endpoint',
        icon: <FaSolidLink />,
        cName: 'nav-text',
        id: 'endpoint',
        tooltip: 'Endpoint of the server',
        placeholder: '/api/v1/humidity',
    },
    {
        title: 'Chart Title',
        icon: <FaSolidPencil />,
        cName: 'nav-text',
        id: 'title',
        tooltip: 'Title of the graph',
        placeholder: 'Kitchen Humidity Data',
    },
    {
        title: 'Y Axis Title',
        icon: <BsGraphDown />,
        cName: 'nav-text',
        id: 'y_axis_title',
        tooltip: 'Y Axis Title',
        placeholder: 'Humidity (%)',
    },
    {
        title: 'Color',
        icon: <FaSolidEyeDropper />,
        cName: 'nav-text',
        id: 'line_color',
        tooltip: 'Graph Line Color',
        placeholder: '#FF0000',
    },
    {
        title: 'JSON ID',
        icon: <FaSolidIdBadge />,
        cName: 'nav-text',
        id: 'object_id',
        tooltip: 'The object member name from the JSON data',
        placeholder: 'humidity_dht',
    },
    {
        title: 'Interval (ms)',
        icon: <FaSolidClock />,
        cName: 'nav-text',
        id: 'interval',
        tooltip: 'The interval in milliseconds to update the graph',
        placeholder: '3000',
    },
]
