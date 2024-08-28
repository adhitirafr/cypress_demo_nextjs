"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";

import withAuth from "utils/withAuth.js"; // Import the HOC
import * as yup from "yup";
import { fetchMemos, createMemo, deleteMemo } from "@/store/reducers/memo";

import "bootstrap/dist/css/bootstrap.min.css";
import "../dashboard.css";
import { BiLogOut } from "react-icons/bi"; // Importing logout icon from react-icons

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  needCheck: yup.boolean().oneOf([true], "You must check the box"),
});

const Dashboard = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const [fetchingMemos, setFetchingMemos] = useState(true);
  const [creatingMemo, setCreatingMemo] = useState(false);
  const [listMemo, setListMemo] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }

    const fetchData = async () => {
      setFetchingMemos(true); // Start fetching
      try {
        const response = await dispatch(fetchMemos({ token })).unwrap();
        setListMemo(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingMemos(false); // End fetching
      }
    };

    fetchData();
  }, [dispatch, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    async (data) => {
      setCreatingMemo(true);

      const token = localStorage.getItem("userToken");

      try {
        const response = await dispatch(createMemo({ data, token })).unwrap();
        setListMemo(response.data);
        setShowAlert(true);
        setAlertType("alert-success");
        setAlertMsg("Memo created successfully!");

        // Reset the form fields after successful submission
        reset({
          title: "",
          description: "",
          needCheck: false,
        });

        // Hide the alert after 3 seconds
        // setTimeout(() => {
        //   setShowAlert(false);
        // }, 3000);
      } catch (err) {
        console.log(err)
        setShowAlert(true);
        setAlertType("alert-danger");
        setAlertMsg("Failed to create memo.");

        // Hide the alert after 3 seconds
        // setTimeout(() => {
        //   setShowAlert(false);
        // }, 3000);
      } finally {
        setCreatingMemo(false);
      }
    },
    [dispatch, reset]
  );

  const onClickDeleteData = useCallback(
    async (id) => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await dispatch(deleteMemo({ id, token })).unwrap();
        setListMemo(response.data);
        setShowAlert(true);
        setAlertType("alert-success");
        setAlertMsg("Memo deleted successfully!");
      } catch (err) {
        setShowAlert(true);
        setAlertType("alert-danger");
        setAlertMsg("Failed to delete memo.");
      }
    },
    [dispatch]
  );

  const handleLogout = () => {
    localStorage.removeItem("userToken"); // Clear the token from local storage
    router.push("/login"); // Redirect to the login page
  };

  if (fetchingMemos) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container vh-100 d-flex justify-content-center align-items-center">
        <div className="row w-100">
          <div className="col-md-6 mb-4 col-sm-12">
            <div className="bg-light rounded p-4 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Memo</h3>
                <button onClick={handleLogout} className="btn btn-link p-0 m-0">
                  <BiLogOut size={24} color="red" />
                </button>
              </div>

              {showAlert && ( 
                <div 
                  id="alert_form" 
                  className={`alert ${alertType} alert-dismissible fade show d-flex justify-content-between align-items-start`} 
                  role="alert" 
                  style={{ cursor: "pointer" }} // Add pointer cursor to indicate clickable 
                >
                  <div className="flex-grow-1">{alertMsg}</div>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the alert from closing due to the outer div's onClick
                      setShowAlert(false);
                    }}
                    style={{ position: "absolute", top: "10px", right: "10px" }} // Position at top-right corner
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    id="name"
                    data-cy="title"
                    className="form-control"
                    {...register("title")}
                    autoFocus
                  />
                  <p id="title_error">{errors.title?.message}</p>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    data-cy="description"
                    className="form-control"
                    rows="3"
                    placeholder="Enter description"
                    {...register("description")}
                  />
                  <p id="description_error">{errors.description?.message}</p>
                </div>

                <div className="mb-3 form-check">
                  <input
                    id="checkboxId"
                    data-cy="checkbox"
                    type="checkbox"
                    className="form-check-input"
                    {...register("needCheck")}
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    checked
                  </label>
                  <p id="check_error">{errors.needCheck?.message}</p>
                </div>

                <button
                  type="submit"
                  data-cy="submit"
                  id="save_button"
                  className="btn btn-success"
                  disabled={creatingMemo} // Disable button while creating memo
                >
                  Save
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-6 col-sm-12">
            <div
              className="bg-light rounded p-4 shadow-sm overflow-auto"
              style={{ maxHeight: "75vh" }}
            >
              {listMemo && listMemo.length > 0 ? (
                listMemo.map((memo) => (
                  <div
                    onClick={() => onClickDeleteData(memo.id)}
                    id={`memo_` + memo.id}
                    key={`memo_` + memo.id}
                    data-cy="memo_card"
                    className="card mb-4"
                  >
                    <div className="card-body">
                      <h5 className="card-title memo-title">{memo.title}</h5>
                      <p className="card-text">{memo.note}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div>No data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Wrap your Dashboard component with the withAuth HOC
export default withAuth(Dashboard);
