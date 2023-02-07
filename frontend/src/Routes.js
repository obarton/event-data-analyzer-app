import React from "react";
import { Route, Routes } from "react-router-dom";
import Events from "./containers/Events";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NewEvent from "./containers/NewEvent";
import NotFound from "./containers/NotFound"
import Signup from "./containers/Signup";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default function Links() {
    return(
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route
                path="/login"
                element={
                    <UnauthenticatedRoute>
                    <Login />
                    </UnauthenticatedRoute>
                }
            />
            <Route
                path="/signup"
                element={
                    <UnauthenticatedRoute>
                    <Signup />
                    </UnauthenticatedRoute>
                }
            />
            <Route
                path="/events/new"
                element={
                    <AuthenticatedRoute>
                    <NewEvent />
                    </AuthenticatedRoute>
                }
            />
            <Route
                path="/events/:id"
                element={
                    <AuthenticatedRoute>
                    <Events />
                    </AuthenticatedRoute>
                }
            />
            <Route path="*" element={<NotFound />} />;
        </Routes>
    )
}