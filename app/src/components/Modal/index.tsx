export default function Modal(props) {
    if (!props.isVisible) return null;

    // create handleClose function
    const handleClose = (e) => {
        if (e.target.id === "wrapper") props.onClose();
    };

    return (
        <div
            id="wrapper"
            onClick={handleClose}
            className="fixed pt-8 mt-7 inset-0 bg-black bg-opacity-25 backdrop-blur-xl flex justify-center items-center content-center self-center"
        >
            <div
                className={`md:w-[${props.width}px] w[90%] mx-auto flex flex-col`}
            >
                <div className="container px-1 flex items-center justify-between">
                    <button
                        type="button"
                        className="ml-auto place-self-end text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-400 p-1 hover:bg-gray-200 inline-flex h-6 w-6 dark:bg-gray-300 dark:text-gray-600 dark:hover:bg-gray-400"
                        aria-label="Close"
                        onClick={() => props.onClose()}
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
                <div className="bg-none p-2 rounded">{props.children}</div>
            </div>
        </div>
    );
}
