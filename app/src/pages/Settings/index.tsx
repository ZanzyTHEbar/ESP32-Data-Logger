/* eslint-disable jsx-a11y/anchor-is-valid */
import "antd/dist/antd.css";
import { ChartData } from "@components/ChartData";
import Input from "@components/SettingsInputs";
import { SettingsPageData } from "@components/SettingsPageData";
import Tooltip from "@components/Tooltip";
//import { Button, Col, Form, Row, Select, Typography } from "antd";
import { useState } from "react";
//import { Color } from "highcharts";

export default function Settings() {
    const settingsData = {
        ip: "",
        endpoint: "",
        title: "",
        y_axis_title: "",
        line_color: "",
        interval: 3000,
        object_id: "",
        cName: "graphContainer",
    };
    const [inputState, setInputState] = useState(settingsData);

    const handleChange = (event, id) => {
        setInputState({ ...inputState, [id]: event.target.value });
    };

    const handleSave = () => {
        //console.log(inputState);
        const isEmpty = Object.keys(ChartData[0]).length === 0;
        //console.log(isEmpty);
        // add  the inputState object to the ChartData array
        if (ChartData.length === 1 && isEmpty) {
            ChartData.pop();
            ChartData.push(inputState);
        } else {
            ChartData.push(inputState);
        }
    };

    const handleReset = () => {
        setInputState(settingsData);
    };

    const handleDeleteAll = () => {
        while (ChartData.length) {
            ChartData.pop();
        }
        ChartData.push(settingsData);
    };

    const handleDelete = () => {
        ChartData.pop();
    };

    return (
        <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-300 z-40">
            <div className="flex items-center justify-center">
                <header
                    style={{
                        color: "#059e8a",
                    }}
                    className="text-2xl font-bold"
                >
                    Settings
                </header>
            </div>
            <div>
                <ul className="flow-root space-y-2 items-center content-center justify-center flex-col">
                    {SettingsPageData.map((item) => (
                        <li
                            key={item.id}
                            className={`${item.cName} pt-2.5 pr-2.5 rounded-xl self-center items-stretch content-center justify-center mr-32 flex-row`}
                        >
                            <Tooltip tooltip={item.tooltip}>
                                <label
                                    className="float-left space-x-2 rounded-sm whitespace-nowrap"
                                    htmlFor={item.id}
                                >
                                    <span className="text-gray-700 dark:text-gray-600">
                                        {item.icon}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-500">
                                        {item.title}
                                    </span>
                                </label>
                            </Tooltip>
                            <div className="float-right">
                                <Input
                                    key={item.id}
                                    type="text"
                                    id={item.id}
                                    placeholder={item.placeholder}
                                    value={inputState[item.id] || ""}
                                    setValue={(event) =>
                                        handleChange(event, item.id)
                                    }
                                />
                            </div>
                        </li>
                    ))}
                    <div className="pl-[6rem] pt-[2rem] pb-[2rem]">
                        <button
                            onClick={handleSave}
                            className="ml-auto bg-blue-700 hover:bg-blue-800 focus:outline-none text-white font-medium text-sm rounded-lg py-2.5 px-5 text-rounded mr-5 shadow-md hover:shadow-xl focus:bg-blue-600 transition duration-100 ease-in focus:shadow-inner"
                        >
                            Add Chart
                        </button>
                        <button
                            onClick={handleDeleteAll}
                            className="ml-auto bg-blue-700 hover:bg-blue-800 focus:outline-none text-white font-medium text-sm rounded-lg py-2.5 px-5 text-rounded mr-5 shadow-md hover:shadow-xl focus:bg-blue-600 transition duration-100 ease-in focus:shadow-inner"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={handleDelete}
                            className="ml-auto bg-blue-700 hover:bg-blue-800 focus:outline-none text-white font-medium text-sm rounded-lg py-2.5 px-5 text-rounded mr-5 shadow-md hover:shadow-xl focus:bg-blue-600 transition duration-100 ease-in focus:shadow-inner"
                        >
                            Delete Last
                        </button>
                        <button
                            onClick={handleReset}
                            className="ml-auto bg-blue-700 hover:bg-blue-800 focus:outline-none text-white font-medium text-sm rounded-lg py-2.5 px-5 text-rounded mr-5 shadow-md hover:shadow-xl focus:bg-blue-600 transition duration-100 ease-in focus:shadow-inner"
                        >
                            Reset Form
                        </button>
                    </div>
                </ul>
            </div>
            <div
                id="dropdown-cta"
                className="p-4 mt-6 bg-blue-50 rounded-lg dark:bg-blue-900"
                role="alert"
            >
                <div className="flex items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-900">
                        Info
                    </span>
                    <button
                        type="button"
                        className="ml-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 inline-flex h-6 w-6 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
                        data-collapse-toggle="dropdown-cta"
                        aria-label="Close"
                    >
                        <span className="sr-only">Close</span>
                        <svg
                            aria-hidden="true"
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
                <p className="mb-3 text-sm text-blue-900 dark:text-blue-400">
                    Your URL is{" "}
                    <u>
                        <em
                            style={{
                                color: "red",
                            }}
                        >
                            required
                        </em>
                    </u>{" "}
                    to be set in order to use the app. Please enter your URL in
                    the settings. The URL must be a valid URL for a <b>GET</b>{" "}
                    request.
                </p>
            </div>
        </div>
    );
}
