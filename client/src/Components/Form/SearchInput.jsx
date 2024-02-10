import React from "react";
import { useSearch } from "../../Context/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './SearchInput.css'

const SearchInput = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(`/api/v1/job/search/${values.keyword}`);

            // Check if data is truthy and has the expected property
            console.log(data)

            setValues({ ...values, results: data});
            navigate('/search');

            console.error("Invalid data structure received from the server:", data);

        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <form
                className="d-flex search-form"
                role="search"
                onSubmit={handleSubmit}
            >
                <input
                    id="custom-input"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={values?.keyword}
                    onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                />
                <button className="custum-btn" type="submit">
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchInput;